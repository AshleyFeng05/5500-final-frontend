import { useEffect, useState } from 'react';
import axios from "axios";

import { Alert, Col, Row, Button, Form, Container, Modal } from 'react-bootstrap';

import './UserAuthModal.css';
import { useDispatch } from 'react-redux';

import { useLoginMutation, useSignupMutation } from '../../services/customerApi';
import { customerLogin } from '../../services/authSlice';

interface UserAuthModalProps {
    show: boolean;
    onHide: () => void;
    defaultSelected?: "signIn" | "signUp";
}

interface FormData {
    signIn: {
        email: string;
        password: string;
    };
    signUp: {
        firstName: string;
        lastName: string;
        email: string;
        country: string;
        mobileNumber: string;
        password: string;
    };
}

const UserAuthModal = ({ show, onHide, defaultSelected = "signIn" }: UserAuthModalProps) => {
    const [selected, setSelected] = useState<"signIn" | "signUp">("signIn");
    const [showPassword, setShowPassword] = useState(false);

    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });

    const [signUpData, setSignUpData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "+1 (US)",
        mobileNumber: "",
        password: "",
    });

    const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVariant, setAlertVariant] = useState<string>("success");
    const closeAlert = () => {
        setAlertMessage(null);
    }

    useEffect(() => {
        if (show) {
            setSelected(defaultSelected);
        }
    }, [show, defaultSelected]);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [signup] = useSignupMutation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        closeAlert();

        try {
            if (selected === "signUp") {
                const { mobileNumber, country, ...rest } = signUpData;
                const combinedPhone = `${country.split(" ")[0]}${mobileNumber}`;
                const dataToSubmit = {
                    ...rest,
                    phone: combinedPhone,
                };

                const response = await signup(dataToSubmit).unwrap();

                console.log(response);
                setAlertVariant("success");
                setAlertMessage("Sign up successful! Please proceed to sign in.");
                setSelected("signIn");

            } else if (selected === "signIn") {
                const user = await login(signInData).unwrap();

                console.log(user);
                dispatch(customerLogin(user));
                setAlertVariant("success");
                setAlertMessage("Sign in successful!");
            }

        } catch (error: any) {
            console.error("Auth error:", error);
            setAlertVariant("danger");
            setAlertMessage(
                error?.data?.message || "An error occurred. Please try again."
            );
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Sign in or Sign up</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-4">
                <div className="modal-body p-0">
                    <div className="toggle-container rounded-pill mx-auto">
                        <button
                            className={`toggle-button rounded-pill ${selected === "signIn" ? "active" : ""}`}
                            onClick={() => { closeAlert(); setSelected("signIn") }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`toggle-button rounded-pill ${selected === "signUp" ? "active" : ""}`}
                            onClick={() => { closeAlert(); setSelected("signUp") }}
                        >
                            Sign Up
                        </button>
                    </div>
                    <Container className="form-container mt-4">
                        <Form onSubmit={handleSubmit}>
                            {selected === "signIn" ? (
                                <>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={signInData.email}
                                            placeholder="Email address"
                                            name="email" onChange={handleSignInChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fw-bold">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={signInData.password}
                                            placeholder="Password"
                                            name="password"
                                            onChange={handleSignInChange}
                                        />
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group controlId="formFirstName">
                                                <Form.Label className="fw-bold">First Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={signUpData.firstName}
                                                    name="firstName"
                                                    onChange={handleSignUpChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formLastname">
                                                <Form.Label className="fw-bold">Last Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={signUpData.lastName}
                                                    name="lastName"
                                                    onChange={handleSignUpChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={signUpData.email}
                                            name="email"
                                            onChange={handleSignUpChange}
                                        />
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group controlId="formCountry">
                                                <Form.Label className="fw-bold">Country</Form.Label>
                                                <Form.Select name="country" onChange={handleSignUpChange} value={signUpData.country}>
                                                    <option>+1 (US)</option>
                                                    <option>+44 (UK)</option>
                                                    <option>+91 (India)</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formMobileNumber">
                                                <Form.Label className="fw-bold">Mobile Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={signUpData.mobileNumber}
                                                    name="mobileNumber"
                                                    onChange={handleSignUpChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Label className="fw-bold">Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                value={signUpData.password}
                                                placeholder="At least 10 characters"
                                                className="pe-5"
                                                name='password'
                                                onChange={handleSignUpChange}
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute top-50 end-0 translate-middle-y fw-bold"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "black",
                                                }}
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </Button>
                                        </div>
                                    </Form.Group>
                                    <Form.Text className="text-muted">
                                        By tapping "Sign Up" or "Continue with...", you agree to DoorDash's{" "}
                                        <a href="#terms">Terms</a>, including a waiver of your jury trial right,
                                        and <a href="#privacy">Privacy Policy</a>. We may text you a verification
                                        code. Msg & data rates apply.
                                    </Form.Text>
                                </>
                            )}
                            {alertMessage && (
                                <Alert variant={alertVariant} onClose={closeAlert} dismissible>
                                    {alertMessage}
                                </Alert>
                            )}
                            <Button variant="danger rounded-pill" type="submit" className="w-100 mt-3">
                                <span className="fw-bold">
                                    {selected === "signIn" ? "Continue to Sign In" : "Sign Up"}
                                </span>
                            </Button>
                            {selected === "signIn" && (
                                <Form.Text className="text-muted mt-3 d-block">
                                    By tapping any “Continue” button, you agree to DoorDash’s{" "}
                                    <a href="#terms">Terms</a>, including a waiver of your jury trial right, and{" "}
                                    <a href="#privacy">Privacy Policy</a>. We may text you a verification code. Msg & data rates apply.
                                </Form.Text>
                            )}
                        </Form>
                    </Container>
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default UserAuthModal;