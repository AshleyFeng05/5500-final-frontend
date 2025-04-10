import { Container, Row, Col } from "react-bootstrap";


import SpotlightImage from "../img/dx_spotlight.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBriefcase, faClock } from "@fortawesome/free-solid-svg-icons";

import styles from "./home.module.css";


import Footer from "../../customer/components/Footer";


const DasherHome = () => {
    return (
        <>

            <div className={`${styles.header_section} text-light`}>
                <Container>
                    <div className={styles.row_wrapper}>
                        <Row className="align-items-center">
                            <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
                                <h1 className="fw-bold">Earn with the best</h1>
                                <p className="mt-3">Deliver with DashDoor and get more opportunities to earn.</p>
                            </Col>

                            <Col md={6} className="text-center d-flex align-items-end">
                                <img
                                    src={SpotlightImage}
                                    alt="Dasher Spotlight"
                                    className="img-fluid"
                                />
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div >


            <Container className={`${styles.features_section} my-5 py-5`}>
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


            <Footer />
        </>
    )
}
export default DasherHome;