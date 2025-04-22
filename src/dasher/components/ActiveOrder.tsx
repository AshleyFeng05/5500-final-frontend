import React from "react";
import { Container, Card, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faMotorcycle, faMapMarkerAlt, faClock, faTimesCircle,
    faStore, faLocationArrow, faMoneyBill, faUtensils, faShoppingBag
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    useGetActiveOrderByDasherIdQuery,
    useDasherUpdateOrderStatusMutation,
    OrderType,
    OrderStatus
} from '../../services/orderApi';
import { RootState } from '../../services/store';
import './ActiveOrder.css';
import { orderApi } from "../../services/orderApi";
import { useDispatch } from "react-redux";


const ActiveOrder: React.FC = () => {
    const dasher = useSelector((state: RootState) => state.auth.dasher);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        data: activeOrder,
        isLoading,
        refetch: refetchActiveOrder
    } = useGetActiveOrderByDasherIdQuery(dasher.id || "", { skip: !dasher.id });

    const [updateOrderStatus, { isLoading: isUpdating }] = useDasherUpdateOrderStatusMutation();

    const handleUpdateStatus = async (newStatus: OrderStatus) => {
        if (activeOrder && dasher) {
            try {
                await updateOrderStatus({
                    orderId: activeOrder.id,
                    status: newStatus,
                    dasherId: dasher.id
                }).unwrap();

                refetchActiveOrder();

                if (newStatus === 'DELIVERED') {
                    dispatch(
                        orderApi.util.invalidateTags([
                            { type: 'Orders', id: `active-${dasher.id}` }
                        ])
                    );
                    navigate('/dasher/dashboard/orders');
                }

            } catch (error) {
                console.error('Failed to update status:', error);
            }
        }
    };

    if (!dasher) {
        return (
            <Container className="py-5 text-center">
                <h3>Please log in to view your deliveries</h3>
                <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => navigate('/dasher')}
                >
                    Dasher Login
                </Button>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading your active delivery...</p>
            </Container>
        );
    }

    if (!activeOrder) {
        return (
            <Container className="py-5 text-center">
                <h3>You don't have any active deliveries</h3>
                <p className="mt-3">Check available orders to start delivering</p>
                <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => navigate('/dasher/available-orders')}
                >
                    Find Available Orders
                </Button>
            </Container>
        );
    }

    const status = activeOrder.status || 'READY';
    const statusInfo = {
        PLACED: {
            color: 'warning',
            text: 'Placed',
            icon: faShoppingBag,
            action: null
        },
        PREPARING: {
            color: 'info',
            text: 'Preparing',
            icon: faUtensils,
            action: null
        },
        READY: {
            color: 'primary',
            text: 'Ready for Pickup',
            icon: faCheckCircle,
            action: { text: 'Picked Up', onClick: () => handleUpdateStatus('ON_THE_WAY') }
        },
        ON_THE_WAY: {
            color: 'info',
            text: 'On The Way',
            icon: faMotorcycle,
            action: { text: 'Mark as Delivered', onClick: () => handleUpdateStatus('DELIVERED') }
        },
        DELIVERED: {
            color: 'success',
            text: 'Delivered',
            icon: faCheckCircle,
            action: null
        },
        CANCELLED: {
            color: 'danger',
            text: 'Cancelled',
            icon: faTimesCircle,
            action: null
        }
    }[status] || {
        color: 'primary',
        text: 'Active Order',
        icon: faCheckCircle,
        action: null
    };



    return (
        <Container className="py-4">
            <h1 className="mb-4">Your Active Delivery</h1>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-0">
                    <Row className="g-0">
                        <Col md={3} className="bg-light p-4 text-center d-flex flex-column align-items-center">
                            <div className={`mb-3  p-3 bg-${statusInfo.color} icon-wrapper`}>
                                <FontAwesomeIcon icon={statusInfo.icon} size='2x' className="text-white" />
                            </div>
                            <Badge bg={statusInfo.color} className="px-3 py-2 d-block mx-auto mb-2">
                                {statusInfo.text}
                            </Badge>
                        </Col>

                        <Col md={6} className="p-4">
                            <div className="d-flex justify-content-between mb-3">
                                <h3>Order #{activeOrder.id ? activeOrder.id.slice(-6).toUpperCase() : ''}</h3>
                                <div>
                                    <FontAwesomeIcon icon={faClock} className="me-2" />
                                    {new Date(activeOrder.orderTime || Date.now()).toLocaleTimeString()}
                                </div>
                            </div>

                            <div className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex">
                                    <FontAwesomeIcon icon={faStore} className="me-2 mt-1" />
                                    <div>
                                        <p className="mb-0 fw-bold">{activeOrder.restaurantName || 'Restaurant'}</p>
                                        <p className="mb-0">{activeOrder.restaurantAddress || 'Address not available'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 mt-1" />
                                    <div>
                                        <p className="mb-0 fw-bold">Delivery Address</p>
                                        <p className="mb-0">{activeOrder.deliveryAddress || 'Address not available'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <h5>Order Items</h5>
                                {Array.isArray(activeOrder.items) && activeOrder.items.map((item, idx) => (
                                    <div key={idx} className="d-flex justify-content-between mb-1">
                                        <span>{item.quantity}x {item.dishName}</span>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                                    <strong>Total</strong>
                                    <div>
                                        <FontAwesomeIcon icon={faMoneyBill} className="me-2 text-success" />
                                        <strong>${activeOrder.totalPrice?.toFixed(2) || '0.00'}</strong>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col md={3} className="p-4 d-flex flex-column">
                            <Button
                                variant="outline-danger"
                                className="mb-3 rounded-pill"
                                onClick={() => {
                                    const address = status === 'READY'
                                        ? activeOrder.restaurantAddress
                                        : activeOrder.deliveryAddress;
                                    if (address) {
                                        window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faLocationArrow} className="me-2" />
                                Open in Maps
                            </Button>

                            {statusInfo.action && (
                                <Button
                                    variant="danger"
                                    className="mt-auto rounded-pill"
                                    onClick={statusInfo.action.onClick}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating...' : statusInfo.action.text}
                                </Button>
                            )}

                            {status === 'DELIVERED' && (
                                <div className="alert alert-success mt-3">
                                    This order has been delivered successfully!
                                </div>
                            )}

                            <Button
                                variant="outline-secondary"
                                className="mt-3 rounded-pill"
                                onClick={refetchActiveOrder}
                            >
                                Refresh
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );

}
export default ActiveOrder;