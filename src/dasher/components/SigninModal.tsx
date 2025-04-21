import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal, Container, Form, Button, Alert } from "react-bootstrap";
import { useLoginMutation } from "../../services/dasherApi";
import { dasherLogin } from "../../services/authSlice";

interface SigninModalProps {
    show: boolean;
    onHide: () => void;
}

const SigninModal = ({ show, onHide }: SigninModalProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login] = useLoginMutation();
    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });

    const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const closeAlert = () => {
        setAlertMessage(null);
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        closeAlert();
        try {
            const dasher = await login(signInData).unwrap();
            console.log(dasher);
            dispatch(dasherLogin(dasher));
            onHide();
            navigate("/dasher/dashboard");
        } catch (error: any) {
            console.error("Error during login:", error);
            setAlertMessage(error?.data?.message || "An error occurred during login.");
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Dasher Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    <div className="modal-body p-0">
                        <Container className="form-container mt-4">
                            <Form onSubmit={handleSubmit} >
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
                                {alertMessage && (
                                    <Alert variant="danger" onClose={closeAlert} dismissible>
                                        {alertMessage}
                                    </Alert>
                                )}
                                <Button variant="danger rounded-pill" type="submit" className="w-100 mt-3">
                                    Sign in
                                </Button>
                                <Form.Text className="text-muted mt-3 d-block">
                                    By tapping any “Continue” button, you agree to DashDoor’s{" "}
                                    <a href="#terms">Terms</a>, including a waiver of your jury trial right, and{" "}
                                    <a href="#privacy">Privacy Policy</a>. We may text you a verification code. Msg & data rates apply.
                                </Form.Text>
                            </Form>
                        </Container>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default SigninModal;