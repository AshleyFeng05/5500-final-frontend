import { useSelector } from 'react-redux';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { RootState } from '../../services/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import UserAuthModal from './UserAuthModal';
import CartOffcanvas from './CartOffcanvas';
import { ReactComponent as Logo } from '../img/logo.svg';

import { selectCartTotalItems } from '../../services/cartSlice';


interface AppNavbarProps {
    showAuthModal: boolean;
    onOpenAuthModal: (mode: "signIn" | "signUp") => void;
    onHideAuthModal: () => void;
    authMode?: "signIn" | "signUp";
}


const AppNavbar = ({ showAuthModal, onOpenAuthModal, onHideAuthModal, authMode }: AppNavbarProps) => {

    const { customerAuthenticated, customer } = useSelector((state: RootState) => state.auth);
    const totalCartItems = useSelector(selectCartTotalItems);

    const [showCart, setShowCart] = useState(false);
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

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
                    <>
                        <Nav className="ms-auto">
                            <Button
                                variant="danger"
                                className="position-relative rounded-pill d-flex align-items-center justify-content-center"
                                onClick={handleShowCart}
                            >
                                <FontAwesomeIcon icon={faCartShopping} className="me-2" />
                                <span className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>
                                    {totalCartItems}
                                </span>
                            </Button>
                        </Nav>
                        <CartOffcanvas
                            show={showCart}
                            onHide={handleCloseCart}
                        />
                    </>
                ) : (
                    <>

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