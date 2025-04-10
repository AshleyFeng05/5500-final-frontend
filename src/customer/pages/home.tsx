import { useState } from "react";

import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-regular-svg-icons';


import styles from "./home.module.css";
import ScootImage from "../img/ScootScoot.svg";
import StoreImage from "../img/Storefront.svg";
import IphoneImage from "../img/iphone.svg";

interface HomeProps {
    handleShowUserAuthModal: (mode: "signIn" | "signUp") => void;
}

const Home = ({ handleShowUserAuthModal }: HomeProps) => {

    return (
        <>

            <div className={styles.top_hero}>
                <div className={styles.hero_text}>
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


            <Container className={`${styles.features_container} my-5 py-5`}>
                <Row>

                    <Col md={4} sm={12} className={`${styles.feature_card} mb-4 text-center`}>
                        <img
                            src={ScootImage}
                            alt="Become a Dasher"
                            className={`${styles.feature_image} mx-auto mb-3`}
                        />
                        <div className={`${styles.feature_text} mx-auto`}>
                            <h4 className="fw-bold">Become a Dasher</h4>
                            <p>As a delivery driver, make money and work on your schedule. Sign up in minutes.</p>
                            <a href="/dasher" className="text-danger fw-bold text-decoration-none">
                                Start earning →
                            </a>
                        </div>
                    </Col>

                    <Col md={4} sm={12} className={`${styles.feature_card} mb-4 text-center`}>
                        <img
                            src={StoreImage}
                            alt="Become a Merchant"
                            className={`${styles.feature_image} mx-auto mb-3`}
                        />
                        <div className={`${styles.feature_text} mx-auto`}>
                            <h4 className="fw-bold">Become a Merchant</h4>
                            <p>Attract new customers and grow sales, starting with 0% commissions for up to 30 days.</p>
                            <a href="" className="text-danger fw-bold text-decoration-none">
                                Sign up for DashDoor →
                            </a>
                        </div>
                    </Col>

                    <Col md={4} sm={12} className={`${styles.feature_card} mb-4 text-center`}>
                        <img
                            src={IphoneImage}
                            alt="Get the best DoorDash experience"
                            className={`${styles.feature_image} mx-auto mb-3`}
                        />
                        <div className={`${styles.feature_text} mx-auto`}>
                            <h4 className="fw-bold">Get the best DashDoor experience</h4>
                            <p>Experience the best your neighborhood has to offer, all in one app.</p>
                            <a href="" className="text-danger fw-bold text-decoration-none">
                                Get the app →
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>

        </>
    )
}
export default Home;