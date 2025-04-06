import { useState } from 'react';

import { Navbar, Container, Nav, Button } from 'react-bootstrap';

import UserAuthModal from './UserAuthModal';


const AppNavbar = () => {

    const [showUserAuthModal, setShowUserAuthModal] = useState(false);
    const handleCloseUserAuthModal = () => setShowUserAuthModal(false);
    const handleShowUserAuthModal = () => setShowUserAuthModal(true);


    return (
        <Navbar bg="light" expand="md" className="shadow-sm" fixed="top">
            <Container>
                <Navbar.Brand href="#home" className="fw-bold text-danger">
                    DASHDOOR
                </Navbar.Brand>

                {/* Toggle for mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="gap-2">
                        <Button variant="danger"
                            className="rounded-pill fw-bold"
                            onClick={handleShowUserAuthModal}
                        >Sign In</Button>
                        <Button variant="light"
                            className="rounded-pill fw-bold"
                            onClick={handleShowUserAuthModal}
                        >Sign Up</Button>
                    </Nav>
                </Navbar.Collapse>
                <UserAuthModal show={showUserAuthModal} onHide={handleCloseUserAuthModal} />
            </Container>
        </Navbar >
    )
}

export default AppNavbar;