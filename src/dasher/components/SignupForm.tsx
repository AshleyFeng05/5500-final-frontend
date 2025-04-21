import { useState } from "react"
import { Alert, Col, Row, Button, Form } from "react-bootstrap"
import styles from "./SignupForm.module.css"
import { useSignupMutation } from "../../services/dasherApi"

import { DasherSignupType } from "../../services/dasherApi"

const SignupForm = () => {

    const [signupData, setSignUpData] = useState<DasherSignupType>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        licenseNumber: "",
        vehicleInfo: ""
    })

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
            setAlertMessage("Signed up successfully! Please proceed to sign in.");
        } catch (error: any) {
            console.error("Error during signup:", error);
            setAlertVariant("danger");
            setAlertMessage(error?.data?.message || "An error occurred during signup.");
        }
    }

    return (
        <>
            <div className={`${styles.signupForm} p-4 rounded-3`}>
                <p className={`mb-4 ${styles.titleText} fw-bold`}>
                    Start earning with DashDoor
                </p>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={signupData.firstName}
                                onChange={handleSignUpChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                className={styles.input}
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                value={signupData.lastName}
                                onChange={handleSignUpChange}
                                required
                            />
                        </Col>
                    </Row>

                    <Form.Control
                        className={`mb-3 ${styles.input}`}
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignUpChange}
                        required
                    />

                    <Form.Control
                        className={`mb-3 ${styles.input}`}
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={signupData.phone}
                        onChange={handleSignUpChange}
                        required
                    />

                    <div className="position-relative mb-3">
                        <Form.Control
                            className={`pe-5 ${styles.input}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={signupData.password}
                            onChange={handleSignUpChange}
                            required
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

                    <Form.Control
                        className={`mb-3 ${styles.input}`}
                        type="text"
                        placeholder="Driver's License Number"
                        name="licenseNumber"
                        value={signupData.licenseNumber}
                        onChange={handleSignUpChange}
                        required
                    />

                    <Form.Control
                        className={`mb-3 ${styles.input}`}
                        as="textarea"
                        rows={2}
                        placeholder="Vehicle Information (Year, Make, Model)"
                        name="vehicleInfo"
                        value={signupData.vehicleInfo}
                        onChange={handleSignUpChange}
                        required
                    />

                    {alertMessage && (
                        <Alert variant={alertVariant} onClose={closeAlert} dismissible>
                            {alertMessage}
                        </Alert>
                    )}

                    <p className={`mb-3 small ${styles.agreementText}`}>
                        By signing up, I agree to DashDoor's Terms of Service, Privacy Policy, and consent to receive communications.
                    </p>

                    <Button
                        variant="danger"
                        type="submit"
                        className={`w-100 rounded-pill ${styles.submitButton}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Sign Up to Dash"}
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default SignupForm;