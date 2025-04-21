import { Container, Row, Col } from "react-bootstrap";
import SpotlightImage from "../img/dx_spotlight.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBriefcase, faClock } from "@fortawesome/free-solid-svg-icons";
import styles from "./home.module.css";
import DasherFooter from "../components/DasherFooter";
import SignupForm from "../components/SignupForm"; // Import the SignupForm component
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { useEffect } from "react";

const DasherHome = () => {

    const navigate = useNavigate();
    const dasherAuthenticated = useSelector(
        (state: RootState) => state.auth.dasherAuthenticated
    );

    useEffect(() => {
        if (dasherAuthenticated) {
            navigate("/dasher/dashboard");
        }
    }, [dasherAuthenticated, navigate]);

    return (
        <>
            <div className={`container-fluid me-0 ${styles.dasherHome}`}>
                <div className="row">
                    <div className={`col-md-6 d-flex flex-column justify-content-center ${styles.leftSection}`}>
                        <h1 className={`mb-4 ${styles.title}`}>
                            Earn with the best
                        </h1>
                        <p>Deliver with DashDoor and get more opportunities to earn.</p>
                        <div className={styles.formContainer}>
                            <SignupForm />
                        </div>
                    </div>

                    <div className={`col-md-6 me-0 p-0 ${styles.rightSection}`}>
                        <div className={styles.imageContainer}>
                            <img
                                src={SpotlightImage}
                                alt="Dasher Spotlight"
                                className={styles.image}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Container className={`${styles.features_section} mt-5 py-5`}>
                <Row>
                    <Col md={4} sm={12} className={`mb-4 text-center`}>
                        <FontAwesomeIcon icon={faUsers} className={`${styles.feature_icon} text-danger mb-3`} />
                        <div className={`${styles.feature_text} mx-auto`}>
                            <h5 className="fw-bold">Work when you want</h5>
                            <p>
                                You decide when, where, and how much you work. Work on your schedule and forget about reporting to an office — or a boss.
                            </p>
                        </div>
                    </Col>

                    <Col md={4} sm={12} className={`mb-4 text-center`}>
                        <FontAwesomeIcon icon={faBriefcase} className={`${styles.feature_icon} text-danger mb-3`} />
                        <div className={`${styles.feature_text} mx-auto`}>
                            <h5 className="fw-bold">Set your own course</h5>
                            <p>
                                Choose whether or not to accept offers, find demand near you, and earn more instantly with promotions like Challenges and Peak Pay in the Dasher app.
                            </p>
                        </div>
                    </Col>

                    <Col md={4} sm={12} className={`mb-4 text-center`}>
                        <FontAwesomeIcon icon={faClock} className={`${styles.feature_icon} text-danger mb-3`} />
                        <div className={`${styles.feature_text} mx-auto`}>
                            <h5 className="fw-bold">Start earning quickly</h5>
                            <p>
                                Sign up in minutes and start earning within days. Once your application is approved, you can start dashing right away and cash out instantly*.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <DasherFooter />
        </>
    );
};

export default DasherHome;