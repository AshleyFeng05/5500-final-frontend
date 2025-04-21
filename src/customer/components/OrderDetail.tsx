import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faMotorcycle,
    faUtensils,
    faTimesCircle,
    faShoppingBag,
    faMapMarkerAlt,
    faClock,
    faStore,
    faArrowLeft,
    faCreditCard,
    faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery, OrderStatus } from '../../services/orderApi';
import { RootState } from '../../services/store';
import { format } from 'date-fns';

import './OrderDetail.css';

const statusConfig = {
    PLACED: {
        color: 'warning',
        text: 'Order Placed',
        icon: faShoppingBag,
        description: 'Your order has been received and is being processed.'
    },
    PREPARING: {
        color: 'info',
        text: 'Preparing',
        icon: faUtensils,
        description: 'The restaurant is preparing your food.'
    },
    READY: {
        color: 'primary',
        text: 'Ready for Pickup',
        icon: faCheckCircle,
        description: 'Your order is ready and waiting for a driver.'
    },
    ON_THE_WAY: {
        color: 'primary',
        text: 'Out for Delivery',
        icon: faMotorcycle,
        description: 'A driver has picked up your order and is on the way.'
    },
    DELIVERED: {
        color: 'success',
        text: 'Delivered',
        icon: faCheckCircle,
        description: 'Your order has been delivered.'
    },
    CANCELLED: {
        color: 'danger',
        text: 'Cancelled',
        icon: faTimesCircle,
        description: 'This order has been cancelled.'
    }
};

const OrderDetail: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const customer = useSelector((state: RootState) => state.auth.customer);

    const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId || '', {
        skip: !orderId
    });

    if (!customer) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to view order details</h3>
                <Button
                    variant="danger"
                    className="mt-3 rounded-pill px-4"
                    onClick={() => navigate('/login', { state: { returnUrl: `/dashboard/orders/${orderId}` } })}
                >
                    Login
                </Button>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading order details...</p>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-danger mb-3">Unable to load order details</h3>
                <p>There was an error loading this order. Please try again later.</p>
                <Button
                    variant="outline-danger"
                    className="mt-3 rounded-pill px-4"
                    onClick={() => navigate('/dashboard/orders')}
                >
                    Back to Orders
                </Button>
            </Container>
        );
    }

    // Format card number to only show last 4 digits
    const formatCardNumber = (cardNumber: string) => {
        if (!cardNumber) return 'Unknown payment method';
        return '•••• •••• •••• ' + cardNumber.slice(-4);
    };

    // Calculate subtotal (without fees)
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return format(date, 'MMMM d, yyyy h:mm a');
    };

    return (
        <Container className="py-4 order-detail-page">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                    variant="outline-secondary"
                    className="rounded-pill"
                    onClick={() => navigate('/dashboard/orders')}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mx-2" />
                    Back to Orders
                </Button>

                <Badge
                    bg={statusConfig[order.status]?.color || 'secondary'}
                    className="px-3 py-2"
                >
                    {statusConfig[order.status]?.text || order.status}
                </Badge>
            </div>

            <h1 className="fw-bold mb-4">Order #{order.id.slice(-6).toUpperCase()}</h1>

            <Row className="mb-4">
                <Col lg={8}>
                    {/* Order Status Card */}
                    <Card className="mb-4 shadow-sm border-0 rounded-3">
                        <Card.Body className="p-4">
                            <h2 className="fs-5 fw-bold mb-3">Order Status</h2>

                            <div className="status-timeline mb-3">
                                <div className="d-flex align-items-center mb-4">
                                    <div className={`status-icon bg-${statusConfig[order.status]?.color || 'secondary'} me-3`}>
                                        <FontAwesomeIcon icon={statusConfig[order.status]?.icon || faStore} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="fs-6 fw-bold mb-1">{statusConfig[order.status]?.text || order.status}</h3>
                                        <p className="mb-0 small text-muted">
                                            {statusConfig[order.status]?.description || 'Your order is being processed.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="time-placed mb-2 ps-5">
                                    <span className="small text-muted">
                                        <FontAwesomeIcon icon={faClock} className="me-2" />
                                        Order placed: {formatDate(order.orderTime)}
                                    </span>
                                </div>
                            </div>

                            {order.dasherId && (
                                <div className="driver-info p-3 rounded-3 mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <FontAwesomeIcon icon={faMotorcycle} size="lg" className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="fs-6 fw-bold mb-1">
                                                {order.status === 'DELIVERED' ? 'Delivered by' : 'Your driver'}
                                            </h3>
                                            <p className="mb-0">{order.dasherName || 'A driver has been assigned to your order'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Order Items Card */}
                    <Card className="mb-4 shadow-sm border-0 rounded-3">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="fs-5 fw-bold mb-0">Order Items</h2>
                                <Badge bg="light" text="dark" className="px-3 py-2 border">
                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </Badge>
                            </div>

                            <div className="restaurant-info mb-3 p-3 rounded-3 bg-light">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <FontAwesomeIcon icon={faStore} className="text-danger" />
                                    </div>
                                    <div>
                                        <h3 className="fs-6 fw-bold mb-1">{order.restaurantName}</h3>
                                        <p className="mb-0 small">{order.restaurantAddress || 'No address provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <Table responsive className="mt-3 border-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Item</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-end">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.dishName}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">
                                                ${((order.totalPrice || 0) / order.items.reduce((total, item) => total + item.quantity, 0) * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Order Summary Card */}
                    <Card className="shadow-sm border-0 rounded-3 sticky-top" style={{ top: '20px' }}>
                        <Card.Body className="p-4">
                            <h2 className="fs-5 fw-bold mb-3">Order Summary</h2>

                            <div className="mb-4">
                                <h3 className="fs-6 mb-3">Delivery Address</h3>
                                <div className="d-flex">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-danger mt-1" />
                                    <div>{order.deliveryAddress || 'No delivery address provided'}</div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="fs-6 mb-3">Payment Method</h3>
                                <div className="d-flex">
                                    <FontAwesomeIcon icon={faCreditCard} className="me-2 text-secondary mt-1" />
                                    <div>
                                        {order.payment ? (
                                            <>
                                                <div>{order.payment.cardHolderName}</div>
                                                <div className="small text-muted">
                                                    {formatCardNumber(order.payment.cardNumber)}
                                                </div>
                                            </>
                                        ) : (
                                            'Payment information not available'
                                        )}
                                    </div>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <h3 className="fs-6 mb-3">Price Details</h3>
                            <div className="price-breakdown">
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="fw-bold">Total</span>
                                    <span className="fw-bold">${order.totalPrice?.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <Button
                                    variant="outline-secondary"
                                    className="rounded-pill py-2"
                                    onClick={() => window.print()}
                                >
                                    <FontAwesomeIcon icon={faReceipt} className="me-2" />
                                    Print Receipt
                                </Button>

                                {order.status === 'DELIVERED' && (
                                    <Button
                                        variant="danger"
                                        className="rounded-pill py-2"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <FontAwesomeIcon icon={faUtensils} className="me-2" />
                                        Order Again
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderDetail;