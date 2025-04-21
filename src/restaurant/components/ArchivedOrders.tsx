import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faMotorcycle,
    faTimesCircle,
    faShoppingBag,
    faMapMarkerAlt,
    faClock,
    faSearch,
    faFilter,
    faUtensils,
    faCalendarAlt,
    faSortAmountDown
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    useGetRestaurantCompletedOrdersQuery,
    OrderType,
    OrderStatus
} from '../../services/orderApi';
import { RootState } from '../../services/store';
import { formatDistanceToNow, format } from 'date-fns';

import './ActiveOrders.css';

const statusConfig = {
    PLACED: {
        color: 'warning',
        text: 'Order Placed',
        icon: faShoppingBag
    },
    PREPARING: {
        color: 'info',
        text: 'Preparing',
        icon: faUtensils
    },
    READY: {
        color: 'primary',
        text: 'Ready for Pickup',
        icon: faCheckCircle
    },
    ON_THE_WAY: {
        color: 'primary',
        text: 'Out for Delivery',
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
    const navigate = useNavigate();
    const restaurant = useSelector((state: RootState) => state.auth.restaurant);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED'>('ALL');
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

    const { data: orders, isLoading, refetch } = useGetRestaurantCompletedOrdersQuery(
        restaurant?.id || '',
        { skip: !restaurant?.id }
    );

    if (!restaurant) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to view archived orders</h3>
                <Button
                    variant="danger"
                    className="mt-3 rounded-pill px-4"
                    onClick={() => navigate('/restaurant/login')}
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
                <p className="mt-3">Loading archived orders...</p>
            </Container>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold mb-0">Archived Orders</h1>
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
                    <h3 className="text-muted mb-3">No archived orders</h3>
                    <p className="mb-0">Your completed and cancelled orders will appear here.</p>
                </Card>
            </Container>
        );
    }

    // Filter orders based on search term and status filter
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            searchTerm === '' ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.dasherName && order.dasherName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter =
            filterStatus === 'ALL' ||
            order.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // Sort orders by time
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const dateA = new Date(a.orderTime).getTime();
        const dateB = new Date(b.orderTime).getTime();

        return sortDirection === 'desc'
            ? dateB - dateA  // Newest first (descending)
            : dateA - dateB; // Oldest first (ascending)
    });

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    return (
        <Container className="py-4 restaurant-orders-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold mb-0">Archived Orders</h1>
                <Button
                    variant="outline-secondary"
                    className="rounded-pill px-4"
                    onClick={() => refetch()}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                    ) : (
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                    )}
                    Refresh
                </Button>
            </div>

            {/* Search and Filters */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <Row>
                        <Col md={7} className="mb-3 mb-md-0">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search by order ID or driver name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faFilter} />
                                </InputGroup.Text>
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="ON_THE_WAY">On the Way</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                        <Col md={2} className="mb-3 mb-md-0">
                            <Button
                                variant="outline-secondary"
                                className="w-100 d-flex align-items-center justify-content-center"
                                onClick={toggleSortDirection}
                                title={sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
                            >
                                <FontAwesomeIcon icon={faSortAmountDown} className="me-1" />
                                <span className="d-none d-sm-inline">
                                    {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
                                </span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Order Count Summary */}
            <div className="d-flex mb-4">
                <div className="me-3">
                    <Badge bg="light" text="dark" className="px-3 py-2 border">
                        Total: {filteredOrders.length} orders
                    </Badge>
                </div>
                <div className="me-3">
                    <Badge bg="success" className="px-3 py-2">
                        Delivered: {filteredOrders.filter(order => order.status === 'DELIVERED').length}
                    </Badge>
                </div>
                <div className="me-3">
                    <Badge bg="primary" className="px-3 py-2">
                        On the Way: {filteredOrders.filter(order => order.status === 'ON_THE_WAY').length}
                    </Badge>
                </div>
                <div className="me-3">
                    <Badge bg="danger" className="px-3 py-2">
                        Cancelled: {filteredOrders.filter(order => order.status === 'CANCELLED').length}
                    </Badge>
                </div>
            </div>

            {/* Orders List */}
            {sortedOrders.length === 0 ? (
                <Card className="shadow-sm border-0 text-center p-5">
                    <div className="mb-3">
                        <FontAwesomeIcon icon={faSearch} size="2x" className="text-muted" />
                    </div>
                    <h3 className="text-muted mb-3">No orders match your filters</h3>
                    <p className="mb-0">Try adjusting your search or filter criteria.</p>
                </Card>
            ) : (
                sortedOrders.map(order => (
                    <Card
                        key={order.id}
                        className={`mb-4 shadow-sm border-0 order-card ${order.status === 'DELIVERED' ? 'delivered-order' :
                            order.status === 'CANCELLED' ? 'cancelled-order' :
                                'other-order'
                            }`}
                    >
                        <Card.Body className="p-0">
                            <Row className="g-0">
                                <Col md={3} className="order-status-col p-4 text-center d-flex flex-column justify-content-center align-items-center">
                                    <div className={`status-icon bg-${statusConfig[order.status]?.color || 'secondary'} mb-3`}>
                                        <FontAwesomeIcon icon={statusConfig[order.status]?.icon || faShoppingBag} className="text-white" />
                                    </div>
                                    <Badge
                                        bg={statusConfig[order.status]?.color || 'secondary'}
                                        className="px-3 py-2 mb-2"
                                    >
                                        {statusConfig[order.status]?.text || order.status}
                                    </Badge>
                                    <span className="small text-muted">
                                        {format(new Date(order.orderTime), 'MMM d, yyyy')}
                                    </span>
                                </Col>

                                <Col md={9} className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h3 className="fs-5 fw-bold mb-0">
                                            Order #{order.id.slice(-6).toUpperCase()}
                                        </h3>
                                        <span className="text-muted small">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                            {formatDistanceToNow(new Date(order.orderTime), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <Row>
                                            <Col md={6}>
                                                <p className="mb-3 small">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-danger" />
                                                    Delivery to: {order.deliveryAddress}
                                                </p>

                                                <div className="order-items mb-3">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="small mb-1">
                                                            <span className="fw-bold me-1">{item.quantity}x</span>
                                                            {item.dishName}
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="small text-muted">
                                                            +{order.items.length - 3} more items
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>

                                            <Col md={6}>
                                                {order.dasherId && (
                                                    <div className="small mb-3">
                                                        <FontAwesomeIcon icon={faMotorcycle} className="me-2 text-primary" />
                                                        Driver: {order.dasherName || 'Unknown'}
                                                    </div>
                                                )}

                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <span className="small text-muted me-2">Total:</span>
                                                        <span className="fw-bold">${order.totalPrice.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default ArchivedOrders;