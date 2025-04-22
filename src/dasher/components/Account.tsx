import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faPhone, faSave, faEdit, faIdCard, faMapMarkerAlt, faCar, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../services/store';
import { useUpdateDasherMutation } from '../../services/dasherApi';
import { setDasher } from "../../services/authSlice";
import { dasherLogout } from "../../services/authSlice";
import './Account.css';

const DasherAccount: React.FC = () => {
    const dispatch = useDispatch();
    const dasher = useSelector((state: RootState) => state.auth.dasher);
    const [updateDasherInfo, { isLoading }] = useUpdateDasherMutation();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        vehicleInfo: 'CAR',
        licenseNumber: ''
    });

    // Edit mode state
    const [editMode, setEditMode] = useState(false);

    // Alert state
    const [alert, setAlert] = useState({
        show: false,
        variant: 'success',
        message: ''
    });

    // Update form data when dasher changes
    useEffect(() => {
        if (dasher) {
            setFormData({
                firstName: dasher.firstName || '',
                lastName: dasher.lastName || '',
                email: dasher.email || '',
                phone: dasher.phone || '',
                address: dasher.address || '',
                vehicleInfo: dasher.vehicleInfo || 'CAR',
                licenseNumber: dasher.licenseNumber || ''
            });
        }
    }, [dasher]);

    // Handle form changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dasher) return;

        try {
            const result = await updateDasherInfo({ ...formData, id: dasher.id }).unwrap();
            dispatch(setDasher(result));

            setAlert({
                show: true,
                variant: 'success',
                message: 'Your account information has been updated successfully!'
            });

            // Exit edit mode
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update dasher information:', error);
            setAlert({
                show: true,
                variant: 'danger',
                message: 'Failed to update your information. Please try again.'
            });
        }
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setEditMode(prev => !prev);
        // Reset alert when entering edit mode
        if (!editMode) {
            setAlert({ show: false, variant: 'success', message: '' });
        }
    };

    if (!dasher) {
        return (
            <Container className="py-5 text-center">
                <h3>Please log in to view your account settings</h3>
                <Button
                    variant="danger"
                    className="mt-3"
                    href="/dasher"
                >
                    Dasher Login
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4 dasher-account-page">
            <h1 className="mb-4">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Account Settings
            </h1>

            {alert.show && (
                <Alert
                    variant={alert.variant}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                    dismissible
                >
                    {alert.message}
                </Alert>
            )}

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="mb-0">Personal Information</h3>
                        <Button
                            className="rounded-pill"
                            variant={editMode ? "outline-secondary" : "outline-danger"}
                            onClick={toggleEditMode}
                            disabled={isLoading}
                        >
                            <FontAwesomeIcon icon={editMode ? faSave : faEdit} className="me-2" />
                            {editMode ? "Cancel" : "Edit Profile"}
                        </Button>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicFirstName">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        First Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        readOnly={!editMode}
                                        className={!editMode ? "bg-light" : ""}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicLastName">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Last Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        readOnly={!editMode}
                                        className={!editMode ? "bg-light" : ""}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        readOnly={!editMode}
                                        className={!editMode ? "bg-light" : ""}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicPhone">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faPhone} className="me-2" />
                                        Phone Number
                                    </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        readOnly={!editMode}
                                        className={!editMode ? "bg-light" : ""}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h4 className="mt-4 mb-3">Delivery Information</h4>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicVehicle">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCar} className="me-2" />
                                        Vehicle Info
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vehicleInfo"
                                        value={formData.vehicleInfo}
                                        onChange={handleInputChange}
                                        readOnly={!editMode}
                                        className={!editMode ? "bg-light" : ""}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicLicense">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faIdCard} className="me-2" />
                                        License Number
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleInputChange}
                                        readOnly={!editMode}
                                        className={!editMode ? "bg-light" : ""}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {editMode && (
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Button
                                    variant="secondary"
                                    onClick={toggleEditMode}
                                    className="me-md-2 rounded-pill"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    className="rounded-pill"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            <Card className="shadow-sm rounded-3 border-0">
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="fs-5 fw-bold mb-1">Session</h3>
                            <p className="text-muted mb-0">Log out from your account</p>
                        </div>
                        <Button
                            variant="outline-danger"
                            className="rounded-pill px-4 py-2"
                            onClick={() => dispatch(dasherLogout())}
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

export default DasherAccount;