import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCustomer, customerLogout } from '../../services/authSlice';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faPen,
    faCreditCard,
    faSave,
    faTimes,
    faTrash,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { CustomerType, PaymentInfoType } from '../../services/customerApi';
import { useUpdateInfoMutation, useAddPaymentInfoMutation, useDeletePaymentInfoMutation } from '../../services/customerApi';
import AddPaymentModal from './AddPaymentModal';
import CustomAlert from '../../util/components/CustomAlert';

import styles from './AccountPage.module.css';

const AccountPage: React.FC = () => {
    const customer = useSelector<RootState, CustomerType | null>(
        (state) => state.auth.customer
    );

    const [updateCustomerInfo, { isLoading }] = useUpdateInfoMutation();
    const [addPaymentInfo, { isLoading: isAddingPayment }] = useAddPaymentInfoMutation();
    const [deletePaymentInfo, { isLoading: isDeletingPayment }] = useDeletePaymentInfoMutation();

    const [editMode, setEditMode] = useState<boolean>(false);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    const dispatch = useDispatch();

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error" | "warning",
    });
    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, show: false }));
    };

    useEffect(() => {
        if (customer) {
            setFormData({
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || '',
            });
        }
    }, [customer]);

    if (!customer) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to view your account</h3>
            </Container>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        console.log('Saving with values:', formData);
        if (!customer.id) {
            setAlert({
                show: true,
                message: "Customer ID not found. Please try logging in again.",
                type: "error"
            });
            return;
        }

        try {
            const response = await updateCustomerInfo({
                customerId: customer.id,
                customer: formData
            }).unwrap();
            console.log(response);
            dispatch(setCustomer(response));
            setEditMode(false);
            setAlert({
                show: true,
                message: "Your account information has been updated successfully!",
                type: "success"
            });
        } catch (error) {
            console.error("Failed to update account information:", error);
            setAlert({
                show: true,
                message: "Failed to update account information. Please try again." + error,
                type: "error"
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
        });
        setEditMode(false);
    };

    // Format card number to show only last 4 digits
    const formatCardNumber = (cardNumber: string) => {
        return '•••• •••• •••• ' + cardNumber.slice(-4);
    };

    const handleAddPayment = async (paymentInfo: PaymentInfoType) => {
        if (!customer?.id) {
            setAlert({
                show: true,
                message: "Customer ID not found. Please try logging in again.",
                type: "error"
            });
            return;
        }

        try {
            const response = await addPaymentInfo({
                customerId: customer.id,
                paymentInfo: paymentInfo
            }).unwrap();

            // Update customer in Redux store
            if (response) {
                dispatch(setCustomer(response));
                setAlert({
                    show: true,
                    message: "Payment method added successfully!",
                    type: "success"
                });
            }
        } catch (error) {
            console.error("Failed to add payment method:", error);
            setAlert({
                show: true,
                message: "Failed to add payment method. Please try again.",
                type: "error"
            });
        }
    };

    const handleDeletePayment = async (payment: PaymentInfoType) => {
        if (!customer?.id) {
            setAlert({
                show: true,
                message: "Customer ID not found. Please try logging in again.",
                type: "error"
            });
            return;
        }

        try {
            const response = await deletePaymentInfo({
                customerId: customer.id,
                paymentInfo: payment
            }).unwrap();

            if (response) {
                dispatch(setCustomer(response));
                setAlert({
                    show: true,
                    message: "Payment method deleted successfully!",
                    type: "success"
                });
            }
        } catch (error) {
            console.error("Failed to delete payment method:", error);
            setAlert({
                show: true,
                message: "Failed to delete payment method. Please try again.",
                type: "error"
            });
        }
    };


    return (
        <Container className={`py-4 ${styles.accountPage}`}>

            <CustomAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                onClose={handleCloseAlert}
            />

            <AddPaymentModal
                show={showAddPaymentModal}
                handleClose={() => setShowAddPaymentModal(false)}
                onAddPayment={handleAddPayment}
                isLoading={isAddingPayment}
            />

            <Row className="mb-4">
                <Col>
                    <h1 className="fw-bold">Account Settings</h1>
                </Col>
            </Row>

            <Card className={`mb-4 shadow-sm rounded-3 ${styles.infoCard}`}>
                <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3 rounded-top-3">

                    <div className="d-flex align-items-center">
                        <div className={styles.avatar}>
                            {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="ms-3">
                            <h2 className="fs-4 fw-bold mb-1">{`${customer.firstName} ${customer.lastName}`}</h2>
                        </div>
                    </div>
                    {!editMode ? (
                        <Button
                            variant="light"
                            className="rounded-pill px-3 py-2"
                            onClick={() => setEditMode(true)}
                        >
                            <FontAwesomeIcon icon={faPen} className="me-2" /> Edit
                        </Button>
                    ) : (
                        <div className="d-flex gap-2">
                            <Button
                                variant="danger"
                                className="rounded-pill px-3 py-2"
                                onClick={handleSave}
                            >
                                <FontAwesomeIcon icon={faSave} className="me-2" /> Save
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="rounded-pill px-3 py-2"
                                onClick={handleCancel}
                            >
                                <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancel
                            </Button>
                        </div>
                    )}
                </Card.Header>

                <Card.Body className="p-4">
                    <Form>
                        <div>
                            <Row className="mb-3">
                                <Col xs={12} sm={3} md={2} className="d-flex align-items-center">
                                    <Form.Label htmlFor="firstName-input" className="mb-0 d-flex align-items-center text-muted">
                                        <FontAwesomeIcon icon={faUser} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Name</span>
                                    </Form.Label>
                                </Col>
                                <Col xs={12} sm={9} md={10}>
                                    <div className={styles.valueContainer}>
                                        {editMode ? (
                                            <Row>
                                                <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                                                    <Form.Control
                                                        id="firstName-input"
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        className={styles.inputField}
                                                        placeholder="First Name"
                                                    />
                                                </Col>
                                                <Col xs={12} sm={6}>
                                                    <Form.Control
                                                        id="lastName-input"
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        className={styles.inputField}
                                                        placeholder="Last Name"
                                                    />
                                                </Col>
                                            </Row>
                                        ) : (
                                            <div className={styles.staticValue}>
                                                {`${formData.firstName} ${formData.lastName}`}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>



                            <Row className="mb-3">
                                <Col xs={12} sm={3} md={2} className="d-flex align-items-center">
                                    <Form.Label htmlFor="email-input" className="mb-0 d-flex align-items-center text-muted">
                                        <FontAwesomeIcon icon={faEnvelope} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Email</span>
                                    </Form.Label>
                                </Col>
                                <Col xs={12} sm={9} md={10}>
                                    <div className={styles.valueContainer}>
                                        {editMode ? (
                                            <Form.Control
                                                id="email-input"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={styles.inputField}
                                                placeholder="Email"
                                            />
                                        ) : (
                                            <div className={styles.staticValue}>{formData.email}</div>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col xs={12} sm={3} md={2} className="d-flex align-items-center">
                                    <Form.Label htmlFor="phone-input" className="mb-0 d-flex align-items-center text-muted">
                                        <FontAwesomeIcon icon={faPhone} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Phone</span>
                                    </Form.Label>
                                </Col>
                                <Col xs={12} sm={9} md={10}>
                                    <div className={styles.valueContainer}>
                                        {editMode ? (
                                            <Form.Control
                                                id="phone-input"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={styles.inputField}
                                                placeholder="Phone"
                                            />
                                        ) : (
                                            <div className={styles.staticValue}>
                                                {formData.phone || <span className="text-muted">Not provided</span>}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col xs={12} sm={3} md={2} className="d-flex align-items-center">
                                    <Form.Label htmlFor="address-input" className="mb-0 d-flex align-items-center text-muted">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Address</span>
                                    </Form.Label>
                                </Col>
                                <Col xs={12} sm={9} md={10}>
                                    <div className={styles.valueContainer}>
                                        {editMode ? (
                                            <Form.Control
                                                id="address-input"
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className={styles.inputField}
                                                placeholder="Address"
                                            />
                                        ) : (
                                            <div className={styles.staticValue}>
                                                {formData.address || <span className="text-muted">Not provided</span>}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <Card className={`mb-4 shadow-sm rounded-3 ${styles.infoCard}`}>
                <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3 rounded-top-3">
                    <h3 className="fs-5 fw-bold mb-0">Payment Methods</h3>
                    <Button variant="outline-danger" className="rounded-pill px-4 py-2" onClick={() => setShowAddPaymentModal(true)}>
                        + Add Payment
                    </Button>
                </Card.Header>
                <Card.Body className="p-4">
                    {customer.paymentInfo && customer.paymentInfo.length > 0 ? (
                        <Row>
                            {customer.paymentInfo.map((payment: PaymentInfoType, index: number) => (
                                <Col md={6} key={index} className="mb-3">
                                    <Card className="border rounded-3 h-100">
                                        <Card.Body className="d-flex align-items-center">
                                            <div className="p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                                                <FontAwesomeIcon icon={faCreditCard} className="text-secondary" />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="fs-6 fw-bold mb-1">{payment.cardHolderName}</h5>
                                                <p className="mb-1 text-muted small">{formatCardNumber(payment.cardNumber)}</p>
                                                <p className="mb-0 text-muted small">Expires {payment.expirationDate}</p>
                                            </div>
                                            <Button variant="outline-secondary"
                                                className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                                style={{ width: '38px', height: '38px' }}
                                                disabled={isDeletingPayment}
                                                onClick={() => handleDeletePayment(payment)}
                                            >
                                                {isDeletingPayment ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <FontAwesomeIcon icon={faTrash} />
                                                )}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted mb-3">No payment methods added yet.</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
            <Card className={`shadow-sm rounded-3 ${styles.infoCard}`}>
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="fs-5 fw-bold mb-1">Session</h3>
                            <p className="text-muted mb-0">Log out from your account</p>
                        </div>
                        <Button
                            variant="outline-danger"
                            className="rounded-pill px-4 py-2"
                            onClick={() => dispatch(customerLogout())}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                            Logout
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AccountPage;