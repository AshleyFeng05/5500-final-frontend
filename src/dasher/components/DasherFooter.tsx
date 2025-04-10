import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faXTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { ReactComponent as FooterImg } from "../img/footer-img.svg";

import "./DasherFooter.css";


const DasherFooter = () => {
    return (
        <footer className="footer bg-dark py-3">
            <Container>
                <Row className="align-items-center">
                    <Col md={2}>
                        <FooterImg className="footer-image me-md-3 mb-2 mb-md-0" />
                    </Col>
                    <Col md={8}>
                        <ul className="footer-links list-inline mb-0">
                            <li className="list-inline-item">
                                <a href="#dasher-agreement">Dasher Agreement</a>
                            </li>
                            <li className="list-inline-item">|</li>
                            <li className="list-inline-item">
                                <a href="#privacy">Privacy</a>
                            </li>
                            <li className="list-inline-item">|</li>
                            <li className="list-inline-item">
                                <a href="#covid-19">COVID-19</a>
                            </li>
                            <li className="list-inline-item">|</li>
                            <li className="list-inline-item">
                                <a href="#personal-info">Do Not Sell or Share My Personal Information</a>
                            </li>
                        </ul>
                    </Col>
                    <Col md={2}>
                        <div className="social-icons mb-3">
                            <FontAwesomeIcon icon={faXTwitter} className="social-icon me-3" />
                            <FontAwesomeIcon icon={faFacebook} className="social-icon me-3" />
                            <FontAwesomeIcon icon={faInstagram} className="social-icon me-3" />
                            <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
                        </div>
                        <p className="mb-0">© 2025 DashDoor</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default DasherFooter;