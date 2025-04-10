import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { ReactComponent as Logo } from "../../customer/img/logo.svg";

const DasherNavbar = () => {

    return (
        <>
            <Navbar bg="light" expand="md" className="shadow-sm" fixed="top">
                <Container>
                    <Navbar.Brand href="/dasher" className="text-danger">
                        <Logo
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            style={{ fill: 'currentColor' }} // Inherit the text-danger color
                        />{' '}
                        DasherCentral
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav className="gap-2">
                            <Button variant="danger"
                                className="rounded-pill fw-bold"

                            >Sign In</Button>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </>
    )
}
export default DasherNavbar;