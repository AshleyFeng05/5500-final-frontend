import { useSelector } from 'react-redux';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { RootState } from '../../services/store';

import UserAuthModal from './UserAuthModal';
import { ReactComponent as Logo } from '../img/logo.svg';


interface AppNavbarProps {
    showAuthModal: boolean;
    onOpenAuthModal: (mode: "signIn" | "signUp") => void;
    onHideAuthModal: () => void;
    authMode?: "signIn" | "signUp";
}


const AppNavbar = ({ showAuthModal, onOpenAuthModal, onHideAuthModal, authMode }: AppNavbarProps) => {

    const { customerAuthenticated, customer } = useSelector((state: RootState) => state.auth);

    return (
        <Navbar bg="light" expand="md" className="shadow-sm" fixed="top">
            <Container>
                <Navbar.Brand href="/" className="fw-bold text-danger">
                    <Logo
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        style={{ fill: 'currentColor' }} // Inherit the text-danger color
                    />{' '}
                    DASHDOOR
                </Navbar.Brand>

                {customerAuthenticated && customer ? (
                    <></>
                ) : (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav className="gap-2">
                                <Button variant="danger"
                                    className="rounded-pill fw-bold"
                                    onClick={() => onOpenAuthModal("signIn")}
                                >Sign In</Button>
                                <Button variant="light"
                                    className="rounded-pill fw-bold"
                                    onClick={() => onOpenAuthModal("signUp")}
                                >Sign Up</Button>
                            </Nav>
                        </Navbar.Collapse>
                        <UserAuthModal
                            show={showAuthModal}
                            onHide={onHideAuthModal}
                            defaultSelected={authMode}
                        />
                    </>
                )}

            </Container>
        </Navbar >
    )
}

export default AppNavbar;