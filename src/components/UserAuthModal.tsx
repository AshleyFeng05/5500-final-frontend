import { useEffect, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './UserAuthModal.css';


interface UserAuthModalProps {
    show: boolean;
    onHide: () => void;
    defaultSelected?: "signIn" | "signUp";
}

const UserAuthModal = ({ show, onHide, defaultSelected = "signIn" }: UserAuthModalProps) => {
    const [selected, setSelected] = useState("signIn");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (show) {
            setSelected(defaultSelected);
        }
    }, [show, defaultSelected]);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior

        if (selected === "signIn") {
            console.log("Sign In form submitted");
            // Add your sign-in logic here
        } else if (selected === "signUp") {
            console.log("Sign Up form submitted");
            // Add your sign-up logic here
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
                            onClick={() => setSelected("signIn")}
                        >
                            Sign In
                        </button>
                        <button
                            className={`toggle-button rounded-pill ${selected === "signUp" ? "active" : ""}`}
                            onClick={() => setSelected("signUp")}
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
                                        <Form.Control type="email" placeholder="Email address" />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fw-bold">Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" />
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group controlId="formFirstName">
                                                <Form.Label className="fw-bold">First Name</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formLastname">
                                                <Form.Label className="fw-bold">Last Name</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <Form.Control type="email" />
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group controlId="formCountry">
                                                <Form.Label className="fw-bold">Country</Form.Label>
                                                <Form.Select>
                                                    <option>+1 (US)</option>
                                                    <option>+44 (UK)</option>
                                                    <option>+91 (India)</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formMobileNumber">
                                                <Form.Label className="fw-bold">Mobile Number</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Label className="fw-bold">Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="At least 10 characters"
                                                className="pe-5"
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