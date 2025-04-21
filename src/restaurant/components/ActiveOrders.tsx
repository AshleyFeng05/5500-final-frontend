import { useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faMotorcycle,
    faUtensils,
    faTimesCircle,
    faShoppingBag,
    faMapMarkerAlt,
    faClock,
    faExclamationTriangle,
    faExclamationCircle,
    faExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    useGetRestaurantActiveOrdersQuery,
    useRestaurantUpdateOrderStatusMutation,
    OrderType,
    OrderStatus
} from '../../services/orderApi';
import { RootState } from '../../services/store';
import CustomAlert from '../../util/components/CustomAlert';
import { formatDistanceToNow, set } from 'date-fns';

import './ActiveOrders.css';

const statusConfig = {
    PLACED: {
        color: 'warning',
        text: 'New Order',
        icon: faShoppingBag,
        description: 'This order needs to be accepted or rejected.'
    },
    PREPARING: {
        color: 'info',
        text: 'Preparing',
        icon: faUtensils,
        description: 'This order is being prepared.'
    },
    READY: {
        color: 'primary',
        text: 'Ready for Pickup',
        icon: faCheckCircle,
        description: 'This order is ready for pickup by a driver.'
    },
    ON_THE_WAY: {
        color: 'primary',
        text: 'Out for Delivery',
        icon: faMotorcycle,
        description: 'This order has been picked up by a driver.'
    },
    DELIVERED: {
        color: 'success',
        text: 'Delivered',
        icon: faCheckCircle,
        description: 'This order has been delivered to the customer.'
    },
    CANCELLED: {
        color: 'danger',
        text: 'Cancelled',
        icon: faTimesCircle,
        description: 'This order has been cancelled.'
    }
};

const statusActions = {
    PLACED: [
        { status: 'PREPARING', text: 'Accept Order', variant: 'success', icon: faCheckCircle },
        { status: 'CANCELLED', text: 'Reject Order', variant: 'danger', icon: faTimesCircle }
    ],
    PREPARING: [
        { status: 'READY', text: 'Mark as Ready', variant: 'primary', icon: faCheckCircle },
        { status: 'CANCELLED', text: 'Cancel Order', variant: 'danger', icon: faTimesCircle }
    ],
    READY: [],
    ON_THE_WAY: [],
    DELIVERED: [],
    CANCELLED: []
};

interface CancelModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}
const CancelOrderModal: React.FC<CancelModalProps> = ({ show, onHide, onConfirm, isLoading }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cancel Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-danger mb-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    Are you sure you want to cancel this order?
                </p>
                <p className="mb-3">This action cannot be undone and the customer will be notified.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => onConfirm()} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Cancelling...
                        </>
                    ) : (
                        'Cancel Order'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const ActiveOrders: React.FC = () => {
    const restaurant = useSelector((state: RootState) => state.auth.restaurant);
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const { data: orders, isLoading, refetch } = useGetRestaurantActiveOrdersQuery(restaurant?.id || '', { skip: !restaurant?.id });

    const [updateOrderStatus, { isLoading: isUpdating }] = useRestaurantUpdateOrderStatusMutation();

    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'warning'
    });
    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, show: false }));
    };

    const handleUpdateStatus = async (order: OrderType, newStatus: OrderStatus) => {
        if (newStatus === "CANCELLED") {
            setSelectedOrder(order);
            setShowCancelModal(true);
            return;
        }

        try {
            await updateOrderStatus({ orderId: order.id, status: newStatus, restaurantId: restaurant?.id || "" }).unwrap();

            setAlert({
                show: true,
                message: `Order #${order.id.slice(-6).toUpperCase()} has been ${newStatus === 'PREPARING' ? 'accepted' :
                    newStatus === 'READY' ? 'marked as ready' :
                        newStatus.toLowerCase()
                    }`,
                type: 'success'
            });
            refetch();
        } catch (error) {
            console.error('Failed to update order status:', error);
            setAlert({
                show: true,
                message: 'Failed to update order status. Please try again.',
                type: 'error'
            });
        }
    };

    const handleConfirmCancel = async () => {
        if (!selectedOrder || !restaurant?.id) return;

        try {
            await updateOrderStatus({ orderId: selectedOrder.id, status: 'CANCELLED', restaurantId: restaurant?.id }).unwrap();
            setAlert({
                show: true,
                message: `Order #${selectedOrder.id.slice(-6).toUpperCase()} has been cancelled.`,
                type: 'success'
            });
            refetch();
        } catch (error) {
            console.error('Failed to cancel order:', error);
            setAlert({
                show: true,
                message: 'Failed to cancel order. Please try again.',
                type: 'error'
            });
        } finally {
            setShowCancelModal(false);
            setSelectedOrder(null);
        }
    };


    if (!restaurant) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to manage orders</h3>
                <Button
                    variant="danger"
                    className="mt-3 rounded-pill px-4"
                    onClick={() => navigate('/restaurant')}
                >
                    Restaurant Login
                </Button>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading active orders...</p>
            </Container>
        );
    }
    if (!orders || orders.length === 0) {
        return (
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold mb-0">Active Orders</h1>
                    <Button
                        variant="outline-secondary"
                        className="rounded-pill px-4"
                        onClick={() => refetch()}
                    >
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        Refresh
                    </Button>
                </div>

                <Card className="shadow-sm border-0 text-center p-5">
                    <div className="mb-4">
                        <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted" />
                    </div>
                    <h3 className="text-muted mb-3">No active orders</h3>
                    <p className="mb-0">When customers place orders, they will appear here.</p>
                </Card>
            </Container>
        );
    }

    const ordersByStatus = orders.reduce((acc, order) => {
        if (!acc[order.status]) {
            acc[order.status] = [];
        }
        acc[order.status].push(order);
        return acc;
    }, {} as Record<OrderStatus, OrderType[]>);

    const statusOrder: OrderStatus[] = ['PLACED', 'PREPARING', 'READY', 'ON_THE_WAY'];

    return (
        <Container className="py-4 restaurant-orders-page">
            <CustomAlert
                show={alert.show}
                onClose={handleCloseAlert}
                message={alert.message}
                type={alert.type}
            />
            <CancelOrderModal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                isLoading={isUpdating}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold mb-0">Active Orders</h1>
                <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => refetch()} disabled={isLoading || isUpdating}>
                    {isLoading ? (
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                    ) : (
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                    )}
                    Refresh
                </Button>
            </div>

            {/* New Orders */}
            {ordersByStatus['PLACED'] && ordersByStatus['PLACED'].length > 0 && (
                <div className="mb-5">
                    <div className="d-flex align-items-center mb-3">
                        <Badge bg="warning" className="me-2 p-2">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                        </Badge>
                        <h2 className="fs-4 fw-bold mb-0">New Orders ({ordersByStatus['PLACED'].length})</h2>
                    </div>

                    {ordersByStatus['PLACED'].map((order) => (
                        <Card key={order.id} className="mb-4 shadow-sm border-0 order-card new-order">
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col md={3} className="order-status-col p-4 text-center d-flex flex-column justify-content-center align-items-center">
                                        <div className={`status-icon bg-${statusConfig[order.status].color} mb-3`}>
                                            <FontAwesomeIcon icon={statusConfig[order.status].icon} className="text-white" />
                                        </div>
                                        <Badge bg={statusConfig[order.status].color} className="px-3 py-2 mb-2">
                                            {statusConfig[order.status].text}
                                        </Badge>
                                        <span className="status-description small text-muted">
                                            {statusConfig[order.status].description}
                                        </span>
                                    </Col>
                                    <Col md={6} className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h3 className="fs-5 fw-bold mb-0">
                                                Order #{order.id.slice(-6).toUpperCase()}
                                            </h3>
                                            <span className="text-muted small">
                                                <FontAwesomeIcon icon={faClock} className="me-1" />
                                                {formatDistanceToNow(new Date(order.orderTime), { addSuffix: true })}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <p className="mb-3 small">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-danger" />
                                                Delivery to: {order.deliveryAddress}
                                            </p>
                                            <div className="order-items mb-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="small mb-1">
                                                        <span className="fw-bold me-1">{item.quantity}x</span>
                                                        {item.dishName}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={3} className="p-4 bg-light d-flex flex-column justify-content-center">
                                        <div className="d-grid gap-2">
                                            {statusActions[order.status]?.map((action, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={action.variant}
                                                    className="d-flex align-items-center rounded-pill justify-content-center"
                                                    onClick={() => handleUpdateStatus(order, action.status as OrderStatus)}
                                                    disabled={isUpdating}
                                                >
                                                    <FontAwesomeIcon icon={action.icon} className="me-2" />
                                                    {action.text}
                                                </Button>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            {statusOrder.slice(1).map(status => (
                ordersByStatus[status] && ordersByStatus[status].length > 0 && (
                    <div className="mb-5" key={status}>
                        <h2 className="fs-4 fw-bold mb-3">
                            {status === 'PREPARING' ? 'Preparing' :
                                status === 'READY' ? 'Ready for Pickup' :
                                    'Out for Delivery'}
                            ({ordersByStatus[status].length})
                        </h2>

                        {ordersByStatus[status].map(order => (
                            <Card
                                key={order.id}
                                className={`mb-4 shadow-sm border-0 order-card ${status.toLowerCase()}-order`}
                            >
                                <Card.Body className="p-0">
                                    <Row className="g-0">
                                        <Col md={3} className="order-status-col p-4 text-center d-flex flex-column justify-content-center align-items-center">
                                            <div className={`status-icon bg-${statusConfig[order.status].color} mb-3`}>
                                                <FontAwesomeIcon icon={statusConfig[order.status].icon} className="text-white" />
                                            </div>
                                            <Badge
                                                bg={statusConfig[order.status].color}
                                                className="px-3 py-2 mb-2"
                                            >
                                                {statusConfig[order.status].text}
                                            </Badge>
                                            <span className="status-description small text-muted">
                                                {statusConfig[order.status].description}
                                            </span>
                                        </Col>

                                        <Col md={6} className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h3 className="fs-5 fw-bold mb-0">
                                                    Order #{order.id.slice(-6).toUpperCase()}
                                                </h3>
                                                <span className="text-muted small">
                                                    <FontAwesomeIcon icon={faClock} className="me-1" />
                                                    {formatDistanceToNow(new Date(order.orderTime), { addSuffix: true })}
                                                </span>
                                            </div>

                                            <div className="mb-3">
                                                <p className="mb-3 small">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-danger" />
                                                    Delivery to: {order.deliveryAddress}
                                                </p>

                                                <div className="order-items mb-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="small mb-1">
                                                            <span className="fw-bold me-1">{item.quantity}x</span>
                                                            {item.dishName}
                                                        </div>
                                                    ))}
                                                </div>

                                                {order.dasherId && (
                                                    <div className="small mb-2 driver-info p-2 rounded">
                                                        <FontAwesomeIcon icon={faMotorcycle} className="me-2 text-primary" />
                                                        Driver: {order.dasherName || 'Assigned'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex align-items-center">
                                                <span className="fw-bold me-3">${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </Col>

                                        <Col md={3} className="p-4 bg-light d-flex flex-column justify-content-center">
                                            <div className="d-grid gap-2">
                                                {statusActions[order.status]?.map((action, idx) => (
                                                    <Button
                                                        key={idx}
                                                        variant={action.variant}
                                                        className="d-flex rounded-pill align-items-center justify-content-center"
                                                        onClick={() => handleUpdateStatus(order, action.status as OrderStatus)}
                                                        disabled={isUpdating}
                                                    >
                                                        <FontAwesomeIcon icon={action.icon} className="me-2" />
                                                        {action.text}
                                                    </Button>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )
            ))}


        </Container>
    )
}
export default ActiveOrders;