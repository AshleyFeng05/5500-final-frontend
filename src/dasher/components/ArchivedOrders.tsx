import React, { useState } from "react";
import { Container, Card, Row, Col, Badge, Spinner, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faMotorcycle, faClock, faTimesCircle,
    faStore, faMoneyBill, faCalendarAlt, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersByDasherIdQuery, OrderType, OrderStatus } from '../../services/orderApi';
import { RootState } from '../../services/store';
import { format, parseISO } from 'date-fns';
import './ArchivedOrders.css';

type FilterOptions = 'all' | 'today' | 'week' | 'month';

const statusConfig = {
    READY: {
        color: 'primary',
        text: 'Ready for Pickup',
        icon: faCheckCircle
    },
    ON_THE_WAY: {
        color: 'info',
        text: 'On The Way',
        icon: faMotorcycle
    },
    DELIVERED: {
        color: 'success',
        text: 'Delivered',
        icon: faCheckCircle
    },
    CANCELLED: {
        color: 'danger',
        text: 'Cancelled',
        icon: faTimesCircle
    }
};

const ArchivedOrders: React.FC = () => {
    const dasher = useSelector((state: RootState) => state.auth.dasher);
    const navigate = useNavigate();
    const [timeFilter, setTimeFilter] = useState<FilterOptions>('all');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

    const {
        data: allOrders,
        isLoading,
        refetch: refetchOrders
    } = useGetOrdersByDasherIdQuery(dasher?.id || "", {
        skip: !dasher?.id,
        refetchOnMountOrArgChange: true
    });

    const filterOrdersByTime = (orders: OrderType[] | undefined, filter: FilterOptions): OrderType[] => {
        if (!orders) return [];

        if (filter === 'all') return orders;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);

        return orders.filter(order => {
            // Handle orderTime correctly based on your OrderType definition
            // If orderTime is already a Date object, use it directly
            // If it's a string, parse it
            const orderDate = order.orderTime instanceof Date
                ? order.orderTime
                : new Date(order.orderTime);

            // Ensure we have a valid date before comparing
            if (isNaN(orderDate.getTime())) {
                console.warn(`Invalid order date for order ${order.id}:`, order.orderTime);
                return false;
            }

            switch (filter) {
                case 'today':
                    return orderDate >= today;
                case 'week':
                    return orderDate >= weekAgo;
                case 'month':
                    return orderDate >= monthAgo;
                default:
                    return true;
            }
        });
    };

    const filterOrdersByStatus = (orders: OrderType[] | undefined, filter: OrderStatus | 'all'): OrderType[] => {
        if (!orders) return [];
        if (filter === 'all') return orders;
        return orders.filter(order => order.status === filter);
    };

    const sortOrdersByDate = (orders: OrderType[]): OrderType[] => {
        return [...orders].sort((a, b) => {
            const dateA = a.orderTime instanceof Date
                ? a.orderTime
                : new Date(a.orderTime);

            const dateB = b.orderTime instanceof Date
                ? b.orderTime
                : new Date(b.orderTime);

            // Fallback to 0 if we can't get valid timestamps
            const timeA = !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
            const timeB = !isNaN(dateB.getTime()) ? dateB.getTime() : 0;

            return timeB - timeA; // newest first
        });
    };

    const filteredOrders = sortOrdersByDate(
        filterOrdersByStatus(
            filterOrdersByTime(allOrders, timeFilter),
            statusFilter
        )
    );

    const getStatusBadge = (status: OrderStatus) => {
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DELIVERED;
        return (
            <Badge bg={config.color} className="py-2 px-3">
                <FontAwesomeIcon icon={config.icon} className="me-1" />
                {config.text}
            </Badge>
        );
    };

    const formatDate = (dateValue: Date | string) => {
        try {
            // If it's already a Date object, format it directly
            // Otherwise parse it as a string
            const date = dateValue instanceof Date
                ? dateValue
                : typeof dateValue === 'string'
                    ? parseISO(dateValue)
                    : new Date(dateValue);

            // Check if the date is valid
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            return format(date, 'MMM d, yyyy h:mm a');
        } catch (error) {
            console.warn('Error formatting date:', dateValue, error);
            return 'Invalid date';
        }
    };

    if (!dasher) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to view your delivery history</h3>
                <Button
                    variant="danger"
                    className="mt-3 rounded-pill px-4"
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
                <p className="mt-3">Loading your order history...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4 order-history-page">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Your Delivery History</h1>
                <Button
                    variant="outline-danger"
                    className="mt-2 mt-md-0 rounded-pill"
                    onClick={() => refetchOrders()}
                >
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    Refresh
                </Button>
            </div>

            <Card className="mb-4 shadow-sm border-0 filter-card">
                <Card.Body>
                    <Row>
                        <Col sm={6} md={4} lg={3}>
                            <Form.Group className="mb-3 mb-md-0">
                                <Form.Label className="fw-bold">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                    Time Period
                                </Form.Label>
                                <Form.Select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value as FilterOptions)}
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Past Week</option>
                                    <option value="month">Past Month</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={4} lg={3}>
                            <Form.Group className="mb-3 mb-md-0">
                                <Form.Label className="fw-bold">
                                    <FontAwesomeIcon icon={faFilter} className="me-2" />
                                    Status
                                </Form.Label>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {(!filteredOrders || filteredOrders.length === 0) ? (
                <Card className="text-center p-5 shadow-sm border-0">
                    <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                    <h4>No orders found</h4>
                    <p className="text-muted">
                        {allOrders && allOrders.length > 0
                            ? 'Try changing your filters to see more orders.'
                            : 'You haven\'t completed any deliveries yet.'}
                    </p>
                    {(!allOrders || allOrders.length === 0) && (
                        <Button
                            variant="primary"
                            className="mt-3 mx-auto"
                            style={{ width: 'fit-content' }}
                            onClick={() => navigate('/dasher/available-orders')}
                        >
                            Find Orders to Deliver
                        </Button>
                    )}
                </Card>
            ) : (
                <>
                    <p className="mb-4">Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}</p>

                    {filteredOrders.map((order) => (
                        <Card key={order.id} className="mb-3 shadow-sm border-0 order-card">
                            <Card.Body>
                                <Row>
                                    <Col xs={12} md={3} className="mb-3 mb-md-0">
                                        <div className="d-flex flex-column h-100">
                                            <div className="mb-2">
                                                <span className="text-muted small">Order ID</span>
                                                <p className="mb-0 fw-bold">#{order.id ? order.id.slice(-6).toUpperCase() : 'N/A'}</p>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted small">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                    Date
                                                </span>
                                                <p className="mb-0">{formatDate(order.orderTime)}</p>
                                            </div>
                                            <div className="mt-auto">
                                                {getStatusBadge(order.status as OrderStatus)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5} className="mb-3 mb-md-0">
                                        <div className="d-flex flex-column h-100">
                                            <div className="mb-2">
                                                <span className="text-muted small">
                                                    <FontAwesomeIcon icon={faStore} className="me-1" />
                                                    Restaurant
                                                </span>
                                                <p className="mb-0 fw-bold">{order.restaurantName || 'Unknown Restaurant'}</p>
                                                <p className="mb-0 small text-truncate">{order.restaurantAddress || 'Address not available'}</p>
                                            </div>
                                            <div className="mt-auto">
                                                <span className="text-muted small">Items</span>
                                                <p className="mb-0 text-truncate">
                                                    {Array.isArray(order.items) && order.items.length > 0
                                                        ? order.items.map(item => `${item.quantity}x ${item.dishName}`).join(', ')
                                                        : 'No items available'}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="d-flex flex-column h-100 align-items-md-end">
                                            <div className="mb-3 text-md-end">
                                                <span className="text-muted small">Earnings</span>
                                                <div className="d-flex align-items-center justify-content-md-end">
                                                    <FontAwesomeIcon icon={faMoneyBill} className="me-2 text-success" />
                                                    <span className="fw-bold">
                                                        ${(order.totalPrice * 0.04 + 3.99).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </>
            )}
        </Container>
    );
};

export default ArchivedOrders;