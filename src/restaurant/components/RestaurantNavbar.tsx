import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { ReactComponent as Logo } from "../../customer/img/logo.svg";
import { useState } from "react";
import SigninModal from "./SigninModal";
import { RootState } from "../../services/store";
import { useSelector } from "react-redux";



const RestaurantNavbar = () => {

    const [showSignIn, setShowSignIn] = useState(false);
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.restaurantAuthenticated
    );

    return (
        <>
            <Navbar bg="light" expand="md" className="shadow-sm" fixed="top">
                <Container>
                    <Navbar.Brand href="/restaurant" className="text-danger">
                        <Logo
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            style={{ fill: 'currentColor' }} // Inherit the text-danger color
                        />{' '}
                        for Restaurants
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    {!isAuthenticated && (<>
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav className="gap-2">
                                <Button variant="danger"
                                    className="rounded-pill fw-bold"
                                    onClick={() => setShowSignIn(true)}
                                >Sign In</Button>
                            </Nav>
                        </Navbar.Collapse>
                        <SigninModal
                            show={showSignIn}
                            onHide={() => setShowSignIn(false)}
                        />
                    </>)}

                </Container>
            </Navbar>
        </>
    )
}
export default RestaurantNavbar;