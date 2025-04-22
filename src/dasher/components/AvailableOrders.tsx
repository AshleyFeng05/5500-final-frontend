import React, { useState } from "react";
import { Container, Card, Row, Col, Badge, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faMotorcycle, faMapMarkerAlt, faClock, faSearch,
    faStore, faMoneyBill, faLocationArrow, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    useGetUnassignedOrdersQuery,
    useAssignOrderToDasherMutation,
    OrderType
} from '../../services/orderApi';
import { RootState } from '../../services/store';
import './AvailableOrders.css';

const AvailableOrders: React.FC = () => {

    const dasher = useSelector((state: RootState) => state.auth.dasher);
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        variant: 'success',
        message: ''
    });

    const { data: unassignedOrders, isLoading, refetch: refetchUnassignedOrders } = useGetUnassignedOrdersQuery("", { skip: !dasher?.id, refetchOnMountOrArgChange: true });
    const [assignOrder, { isLoading: isAssigning }] = useAssignOrderToDasherMutation();

    const handleSelectOrder = (order: OrderType) => {
        setSelectedOrder(order);
        setConfirmationVisible(true);
    };

    const handleConfirmAssignment = async () => {
        if (!selectedOrder || !dasher) return;

        try {
            await assignOrder({ orderId: selectedOrder.id, dasherId: dasher.id }).unwrap();
            setAlert({
                show: true,
                variant: 'success',
                message: 'Order assigned successfully! You can now start your delivery.'
            });
            setConfirmationVisible(false);
            navigate(`/dasher/dashboard`);
        } catch (error) {
            console.error('Failed to assign order:', error);
            setAlert({
                show: true,
                variant: 'danger',
                message: 'Failed to assign order. You might already have an active order.'
            });
            setConfirmationVisible(false);
        }
    }

    if (!dasher) {
        return (
            <Container className="py-5 text-center">
                <h3>Please log in to view available deliveries</h3>
                <Button
                    variant="danger"
                    className="mt-3 rounded-pill"
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
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading available deliveries...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4 available-orders-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Available Deliveries</h1>
                <Button
                    variant="outline-danger"
                    className="rounded-pill px-4"
                    onClick={refetchUnassignedOrders}
                    disabled={isAssigning}
                >
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    Refresh
                </Button>
            </div>

            {alert.show && (
                <Alert
                    variant={alert.variant}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                    dismissible
                >
                    {alert.message}
                </Alert>
            )}

            <Modal
                show={confirmationVisible}
                onHide={() => setConfirmationVisible(false)}
                centered
                backdrop="static"
                className="delivery-confirmation-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delivery Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3 text-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning mb-3" />
                        <p className="mb-1">Are you sure you want to accept this delivery?</p>
                        <p className="small text-muted">You cannot cancel after accepting this order.</p>
                    </div>

                    {selectedOrder && (
                        <Card className="p-3 bg-light border-0 mb-3">
                            <Row className="g-2">
                                <Col xs={12}>
                                    <div className="d-flex align-items-start mb-2">
                                        <FontAwesomeIcon icon={faStore} className="me-2 mt-1 text-danger" />
                                        <div>
                                            <p className="mb-0 fw-bold">{selectedOrder.restaurantName}</p>
                                            <p className="mb-0 small text-muted text-truncate">{selectedOrder.restaurantAddress}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <div className="d-flex align-items-start mb-2">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 mt-1 text-danger" />
                                        <div>
                                            <p className="mb-0 fw-bold">Delivery Address</p>
                                            <p className="mb-0 small text-muted text-truncate">{selectedOrder.deliveryAddress}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-center p-2 border border-success rounded bg-white">
                                        <p className="small mb-1 text-muted">Estimated Earnings</p>
                                        <p className="fw-bold text-success mb-0">
                                            ${(selectedOrder.totalPrice * 0.04 + 3.99).toFixed(2)}
                                        </p>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-center p-2 border border-primary rounded bg-white">
                                        <p className="small mb-1 text-muted">Est. Distance</p>
                                        <p className="fw-bold text-primary mb-0">~3.2 miles</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => setConfirmationVisible(false)}
                        disabled={isAssigning}
                        className="rounded-pill"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmAssignment}
                        disabled={isAssigning}
                        className="rounded-pill"
                    >
                        {isAssigning ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Accepting...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                                Accept Delivery
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {(!unassignedOrders || unassignedOrders.length === 0) ? (
                <Card className="shadow-sm border-0 text-center p-5">
                    <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                    <h3>No available deliveries</h3>
                    <p className="text-muted mb-4">Check back soon for new delivery opportunities!</p>
                    <Button
                        variant="outline-danger"
                        className="mx-auto rounded-pill"
                        style={{ width: 'fit-content' }}
                        onClick={refetchUnassignedOrders}
                    >
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        Check Again
                    </Button>
                </Card>
            ) : (
                <>
                    <p className="mb-4">Found {unassignedOrders.length} available {unassignedOrders.length === 1 ? 'order' : 'orders'} for delivery.</p>

                    {unassignedOrders.map(order => (
                        <Card key={order.id} className="mb-4 shadow-sm border-0 order-card">
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col md={3} className="p-4 text-center d-flex flex-column justify-content-center bg-light">
                                        <div className="mb-3 mx-auto p-3 bg-primary icon-wrapper">
                                            <FontAwesomeIcon icon={faCheckCircle} size="2x" className="text-white" />
                                        </div>
                                        <Badge bg="primary" className="px-3 py-2 d-block mx-auto mb-2">
                                            Ready for Pickup
                                        </Badge>
                                        <span className="small text-muted d-block mb-2">
                                            This order is ready for delivery
                                        </span>
                                    </Col>

                                    <Col md={6} className="p-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <h4 className="fs-5 fw-bold mb-0">
                                                Order #{order.id ? order.id.slice(-6).toUpperCase() : 'N/A'}
                                            </h4>
                                            <div className="text-muted small">
                                                <FontAwesomeIcon icon={faClock} className="me-1" />
                                                {order.orderTime instanceof Date
                                                    ? order.orderTime.toLocaleTimeString()
                                                    : new Date(order.orderTime).toLocaleTimeString()}
                                            </div>
                                        </div>

                                        <div className="restaurant-info mb-3 p-3 bg-light rounded">
                                            <div className="d-flex align-items-start">
                                                <FontAwesomeIcon icon={faStore} className="me-2 mt-1 text-danger" />
                                                <div>
                                                    <p className="mb-0 fw-bold">{order.restaurantName}</p>
                                                    <p className="mb-0 small text-muted">{order.restaurantAddress}</p>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-primary small"
                                                        onClick={() => {
                                                            if (order.restaurantAddress) {
                                                                window.open(`https://maps.google.com/?q=${encodeURIComponent(order.restaurantAddress)}`, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faLocationArrow} className="me-1" />
                                                        View on map
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="delivery-info mb-3 p-3 bg-light rounded">
                                            <div className="d-flex align-items-start">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 mt-1 text-danger" />
                                                <div>
                                                    <p className="mb-0 fw-bold">Delivery To</p>
                                                    <p className="mb-0 small text-muted">{order.deliveryAddress}</p>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-primary small"
                                                        onClick={() => {
                                                            if (order.deliveryAddress) {
                                                                window.open(`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faLocationArrow} className="me-1" />
                                                        View on map
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {Array.isArray(order.items) && order.items.length > 0 && (
                                            <div className="order-items mb-3">
                                                <p className="mb-2 small fw-bold">Order Items ({order.items.length}):</p>
                                                <p className="mb-0 small text-truncate">
                                                    {order.items.map(item => `${item.quantity}x ${item.dishName}`).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </Col>

                                    <Col md={3} className="p-4 bg-light d-flex flex-column justify-content-between">
                                        <div>
                                            <p className="mb-1 small text-center">Estimated Earnings:</p>
                                            <div className="text-center mb-3">
                                                <FontAwesomeIcon icon={faMoneyBill} className="me-2 text-success" />
                                                <span className="fs-4 fw-bold text-success">
                                                    ${(order.totalPrice * 0.04 + 3.99).toFixed(2)}
                                                </span>
                                            </div>

                                            <p className="mb-1 small text-center">Estimated Distance:</p>
                                            <p className="mb-3 text-center">~3.2 miles</p>
                                        </div>

                                        <Button
                                            variant="danger"
                                            className="rounded-pill"
                                            onClick={() => handleSelectOrder(order)}
                                            disabled={isAssigning}
                                        >
                                            <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                                            Accept Delivery
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </>
            )}
        </Container>
    )
}
export default AvailableOrders;