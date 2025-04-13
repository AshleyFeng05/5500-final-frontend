import { useState } from 'react';

import { Alert, Col, Row, Button, Form } from 'react-bootstrap';

import styles from "./SignupForm.module.css";

import { useSignupMutation } from '../../services/restaurantApi';

interface RestaurantSignupData {
    name: string;
    address: string;
    email: string;
    phone: string;
    password: string;
}

const SignupForm = () => {

    const [signupData, setSignUpData] = useState<RestaurantSignupData>({
        name: "",
        address: "",
        email: "",
        phone: "",
        password: ""
    });

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

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    }
    const [signup, { isLoading }] = useSignupMutation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        closeAlert();
        try {
            const response = await signup(signupData).unwrap();
            console.log(response);
            setAlertVariant("success");
            setAlertMessage("Restaurant created successfully! Please proceed to sign in.");
        } catch (error: any) {
            console.error("Error during signup:", error);
            setAlertVariant("danger");
            setAlertMessage(error?.data?.message || "An error occurred during signup.");
        }
    }

    return (
        <>
            <div className={`mt-4 ${styles.signupForm}`}>
                <p className={`mb-4 ${styles.titleText}`}>
                    Start earning with DashDoor
                </p>
                <Form onSubmit={handleSubmit} >
                    <Form.Control
                        className={`mb-3 ${styles.input}`}
                        type="text"
                        placeholder="Business Name"
                        name="name"
                        value={signupData.name}
                        onChange={handleSignUpChange}
                    />
                    <Form.Control
                        className={`mb-3 ${styles.input}`}
                        type="text"
                        placeholder="Business Address"
                        name="address"
                        value={signupData.address}
                        onChange={handleSignUpChange}
                    />
                    <Row className="mb-3">
                        <Col>
                            <Form.Control
                                className={`${styles.input}`}
                                type="text"
                                placeholder="Email Address"
                                name="email"
                                value={signupData.email}
                                onChange={handleSignUpChange}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                className={`${styles.input}`}
                                type="text"
                                placeholder="Business Phone"
                                name="phone"
                                value={signupData.phone}
                                onChange={handleSignUpChange}
                            />
                        </Col>
                    </Row>

                    <div className="position-relative">
                        <Form.Control
                            className={`mb-3 pe-5 ${styles.input}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={signupData.password}
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

                    {alertMessage && (
                        <Alert variant={alertVariant} onClose={closeAlert} dismissible>
                            {alertMessage}
                        </Alert>
                    )}

                    <p className={`mb-3 small ${styles.agreementText}`}>
                        By clicking “Start Free Trial,” I agree to receive marketing electronic
                        communications from DoorDash.
                    </p>
                    <Button variant="danger" type="submit" className={`w-45 rounded-pill ${styles.submitButton}`}>
                        Start Free Trial
                    </Button>


                </Form>
            </div>
        </>
    );
};
export default SignupForm;