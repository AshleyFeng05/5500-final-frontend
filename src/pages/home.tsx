import { useState } from "react";

import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-regular-svg-icons';

import AppNavbar from "../components/AppNavbar"
import Footer from "../components/Footer";

import './home.css'
import ScootImage from "../img/ScootScoot.svg";
import StoreImage from "../img/Storefront.svg";
import IphoneImage from "../img/iphone.svg";

const Home = () => {

    const [showUserAuthModal, setShowUserAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");

    const handleShowUserAuthModal = (mode: "signIn" | "signUp") => {
        setAuthMode(mode);
        setShowUserAuthModal(true);
    }
    const handleCloseUserAuthModal = () => setShowUserAuthModal(false);


    return (
        <>
            <AppNavbar
                showAuthModal={showUserAuthModal}
                onOpenAuthModal={handleShowUserAuthModal}
                onHideAuthModal={handleCloseUserAuthModal}
                authMode={authMode}
            />

            <div style={{ marginTop: '56px' }}>
                <div className="top-hero">
                    <div className="hero-text">
                        <h1 className="text-light fw-bold">Discover restaurants and more near you.</h1>
                        <p className="text-light">Just restaurants actually...</p>
                    </div>
                    <br />
                    <Button variant="light"
                        className="rounded-pill fw-bold"
                        onClick={() => handleShowUserAuthModal("signIn")}
                    ><FontAwesomeIcon icon={faUser} />
                        {" "}Sign in to get started
                    </Button>
                </div>


                <Container className="features-container my-5 py-5">
                    <Row>
                        {/* Feature 1 */}
                        <Col md={4} sm={12} className="feature-card mb-4 text-center">
                            <img
                                src={ScootImage}
                                alt="Become a Dasher"
                                className="feature-image mx-auto mb-3"
                            />
                            <div className="feature-text mx-auto">
                                <h4 className="fw-bold">Become a Dasher</h4>
                                <p>As a delivery driver, make money and work on your schedule. Sign up in minutes.</p>
                                <Button variant="link" className="text-danger fw-bold">
                                    Start earning →
                                </Button>
                            </div>
                        </Col>

                        {/* Feature 2 */}
                        <Col md={4} sm={12} className="feature-card mb-4 text-center">
                            <img
                                src={StoreImage}
                                alt="Become a Merchant"
                                className="feature-image mx-auto mb-3"
                            />
                            <div className="feature-text mx-auto">
                                <h4 className="fw-bold">Become a Merchant</h4>
                                <p>Attract new customers and grow sales, starting with 0% commissions for up to 30 days.</p>
                                <Button variant="link" className="text-danger fw-bold">
                                    Sign up for DashDoor →
                                </Button>
                            </div>
                        </Col>

                        {/* Feature 3 */}
                        <Col md={4} sm={12} className="feature-card mb-4 text-center">
                            <img
                                src={IphoneImage}
                                alt="Get the best DoorDash experience"
                                className="feature-image mx-auto mb-3"
                            />
                            <div className="feature-text mx-auto">
                                <h4 className="fw-bold">Get the best DashDoor experience</h4>
                                <p>Experience the best your neighborhood has to offer, all in one app.</p>
                                <Button variant="link" className="text-danger fw-bold">
                                    Get the app →
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div >
        </>
    )
}
export default Home;