import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';


import { ReactComponent as Logo } from '../img/logo.svg';

import "./Footer.css"


const Footer = () => {
    return (
        <footer className="footer bg-dark py-3">
            <Container>
                <Row className="align-items-center">
                    <Col md={9} xs={12} className="d-flex flex-column flex-md-row align-items-center text-center text-md-start mb-3 mb-md-0">
                        <Logo className="footer-logo me-md-3 mb-2 mb-md-0" />
                        <ul className="footer-links list-inline mb-0">
                            <li className="list-inline-item">
                                <a href="#terms">Terms of Service</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#privacy">Privacy</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#locations">Delivery Locations</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#personal-info">Do Not Sell or Share My Personal Information</a>
                            </li>
                            <li className="list-inline-item">
                                <span>© 2025 DashDoor</span>
                            </li>
                        </ul>
                    </Col>
                    <Col md={3} xs={12} className="text-center text-md-end">
                        <FontAwesomeIcon icon={faFacebook} className="me-3" />
                        <FontAwesomeIcon icon={faXTwitter} className="me-3" />
                        <FontAwesomeIcon icon={faInstagram} />
                    </Col>
                </Row>

            </Container>

        </footer>
    )
};
export default Footer;