import { Offcanvas } from "react-bootstrap";

interface CartOffcanvasProps {
    show: boolean;
    onHide: () => void;
}

const CartOffcanvas = ({ show, onHide }: CartOffcanvasProps) => {
    return (
        <Offcanvas show={show} onHide={onHide} placement="end">

        </Offcanvas>
    )
};
export default CartOffcanvas;