import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faMotorcycle,
    faUtensils,
    faTimesCircle,
    faShoppingBag,
    faMapMarkerAlt,
    faClock,
    faStore
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetCustomerOrdersQuery, OrderType, OrderStatus } from '../../services/orderApi';
import { RootState } from '../../services/store';
import { formatDistanceToNow } from 'date-fns';

import './Orders.css';

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


const Orders: React.FC = () => {

    const navigate = useNavigate();
    const customer = useSelector((state: RootState) => state.auth.customer);

    const { data: orders, isLoading, error } = useGetCustomerOrdersQuery(
        customer?.id || '',
        { skip: !customer?.id }
    );

    const sortOrders = (orders: OrderType[]) => {
        const orderPriority = {
            'PLACED': 0,
            'PREPARING': 1,
            'READY': 2,
            'ON_THE_WAY': 3,
            'DELIVERED': 4,
            'CANCELLED': 5
        };

        return [...orders].sort((a, b) => {
            // First sort by status priority
            const priorityDiff =
                (orderPriority[a.status] ?? 999) -
                (orderPriority[b.status] ?? 999);

            if (priorityDiff !== 0) return priorityDiff;

            // Then sort by date (newest first)
            return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
        });
    };


    if (!customer) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to view your orders</h3>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading your orders...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-danger mb-3">Unable to load orders</h3>
                <p>There was an error loading your orders. Please try again later.</p>
                <Button
                    variant="outline-danger"
                    className="mt-3 rounded-pill px-4"
                    onClick={() => navigate('/')}
                >
                    Go Home
                </Button>
            </Container>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Container className="py-5 text-center">
                <div className="mb-4">
                    <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted" />
                </div>
                <h3 className="text-muted mb-3">No orders yet</h3>
                <p className="mb-4">You haven't placed any orders yet. Hungry?</p>
                <Button
                    variant="danger"
                    className="rounded-pill px-4 py-2"
                    onClick={() => navigate('/dashboard')}
                >
                    Browse Restaurants
                </Button>
            </Container>
        );
    }

    const sortedOrders = sortOrders(orders);
    const activeOrders = sortedOrders.filter(order =>
        !['DELIVERED', 'CANCELLED'].includes(order.status)
    );
    const pastOrders = sortedOrders.filter(order =>
        ['DELIVERED', 'CANCELLED'].includes(order.status)
    );


    return (
        <Container className="py-4 orders-page">

            <h1 className="fw-bold mb-4">Your Orders</h1>

            {activeOrders.length > 0 && (
                <div className="mb-5">
                    <h2 className="fs-4 fw-bold mb-3">Active Orders</h2>

                    {activeOrders.map(order => (
                        <Card key={order.id}
                            className="mb-4 shadow-sm border-0 order-card"
                        >
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col md={3} className="order-status-col p-4 text-center d-flex flex-column justify-content-center align-items-center">
                                        <div className={`status-icon bg-${statusConfig[order.status]?.color || 'secondary'} mb-3`}>
                                            <FontAwesomeIcon icon={statusConfig[order.status]?.icon || faStore} className="text-white" />
                                        </div>
                                        <Badge
                                            bg={statusConfig[order.status]?.color || 'secondary'}
                                            className="px-3 py-2 mb-2"
                                        >
                                            {statusConfig[order.status]?.text || order.status}
                                        </Badge>
                                        <span className="status-description small text-muted">
                                            {statusConfig[order.status]?.description || 'Your order is being processed.'}
                                        </span>
                                    </Col>

                                    <Col md={9} className="p-4">
                                        <div className="d-flex justify-content-between mb-3 align-items-start">
                                            <h3 className="fs-5 fw-bold mb-0">
                                                Order #{order.id.slice(-6).toUpperCase()}
                                            </h3>
                                            <span className="text-muted small">
                                                <FontAwesomeIcon icon={faClock} className="me-1" />
                                                {formatDistanceToNow(new Date(order.orderTime), { addSuffix: true })}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <p className="mb-1 fw-bold">{order.restaurantName}</p>
                                            <p className="mb-3 small">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-danger" />
                                                {order.deliveryAddress || "No delivery address provided"}
                                            </p>

                                            <div className="order-items mb-3">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="small mb-1">
                                                        <span className="fw-bold me-1">{item.quantity}x</span>
                                                        {item.dishName}
                                                    </div>
                                                ))}
                                            </div>

                                            {order.dasherId && (
                                                <div className="small mb-3 driver-info">
                                                    <FontAwesomeIcon icon={faMotorcycle} className="me-2 text-primary" />
                                                    {order.dasherName ? `Driver: ${order.dasherName}` : 'Your order has been assigned to a driver'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">${order.totalPrice?.toFixed(2)}</span>

                                            <Button
                                                variant="outline-danger"
                                                className="rounded-pill px-4"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/orders/${order.id}`);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
                <div>
                    <h2 className="fs-4 fw-bold mb-3">Past Orders</h2>

                    {pastOrders.map(order => (
                        <Card
                            key={order.id}
                            className="mb-4 shadow-sm border-0 order-card past-order"
                        >
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col md={3} className="order-status-col p-4 text-center d-flex flex-column justify-content-center align-items-center">
                                        <div className={`status-icon bg-${statusConfig[order.status]?.color || 'secondary'} mb-3`}>
                                            <FontAwesomeIcon icon={statusConfig[order.status]?.icon || faStore} className="text-white" />
                                        </div>
                                        <Badge
                                            bg={statusConfig[order.status]?.color || 'secondary'}
                                            className="px-3 py-2 mb-2"
                                        >
                                            {statusConfig[order.status]?.text || order.status}
                                        </Badge>
                                    </Col>

                                    <Col md={9} className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h3 className="fs-5 fw-bold mb-0">
                                                Order #{order.id.slice(-6).toUpperCase()}
                                            </h3>
                                            <span className="text-muted small">
                                                {new Date(order.orderTime).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <p className="mb-1 fw-bold">{order.restaurantName}</p>

                                            <div className="order-items mb-3">
                                                {order.items?.slice(0, 2).map((item, idx) => (
                                                    <div key={idx} className="small mb-1">
                                                        <span className="fw-bold me-1">{item.quantity}x</span>
                                                        {item.dishName}
                                                    </div>
                                                ))}
                                                {order.items && order.items.length > 2 && (
                                                    <div className="small text-muted">
                                                        +{order.items.length - 2} more items
                                                    </div>
                                                )}
                                            </div>

                                            {order.dasherName && (
                                                <div className="small mb-2 text-muted">
                                                    <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                                                    Delivered by: {order.dasherName}
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">${order.totalPrice?.toFixed(2)}</span>

                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="rounded-pill px-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/orders/${order.id}`);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    )

};
export default Orders;