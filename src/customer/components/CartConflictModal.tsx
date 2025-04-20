import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    replaceCartWithNewDish,
    selectCartConflict,
    cancelCartConflict
} from "../../services/cartSlice";
import "./CartConflictModal.css";


const RestaurantConflictModal = () => {
    const dispatch = useDispatch();
    const conflict = useSelector(selectCartConflict);

    return (
        <Modal
            show={conflict.show}
            onHide={() => dispatch(cancelCartConflict())}
            centered
            className="restaurant-conflict-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Replace Your Cart?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Your cart contains items from a different restaurant.
                </p>
                <p className="text-danger warning-text">
                    Would you like to replace your cart with the new dish?
                </p>
                <p>
                    You can only order from one restaurant at a time.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    className="rounded-pill"
                    onClick={() => dispatch(cancelCartConflict())}
                >
                    Keep Current Items
                </Button>
                <Button
                    variant="danger"
                    className="rounded-pill"
                    onClick={() => dispatch(replaceCartWithNewDish())}
                >
                    Replace Cart
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default RestaurantConflictModal;