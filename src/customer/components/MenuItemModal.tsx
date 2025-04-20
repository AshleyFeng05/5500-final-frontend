import { DishType } from "../../services/dishApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../services/cartSlice";
import { Modal, Button, Image, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./MenuItemModal.css";


interface MenuItemModalProps {
    show: boolean;
    onHide: () => void;
    menuItem: DishType | null;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ show, onHide, menuItem }) => {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    }

    const handleAddToCart = () => {
        if (menuItem) {
            dispatch(addToCart({ dish: menuItem, quantity }));
        }
        setQuantity(1);
        onHide();
    }

    const handleClose = () => {
        setQuantity(1);
        onHide();
    };

    if (!menuItem) {
        return null
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className={`border-bottom-0`}>
            </Modal.Header>

            <Modal.Body className="py-0">

                <div className="menu-item-modal-dish-info">
                    <h3 className={`fw-bold mb-2`}>{menuItem.name}</h3>

                    <div className={`menu-item-modal-dish-price mb-2`}>${menuItem.price.toFixed(2)}</div>
                    {menuItem.description && (
                        <div className="menu-item-modal-dish-description">
                            {menuItem.description}
                        </div>
                    )}

                </div>
                <div className="menu-item-modal-image-container">
                    <Image
                        src={menuItem.imageUrl}
                        alt={menuItem.name}
                        className="menu-item-modal-dish-image"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className={`menu-item-modal-footer d-flex justify-content-between align-items-center`}>
                <div className={`d-flex align-items-center`}>
                    <Button
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        className="menu-item-modal-quantity-buttons"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Form.Control
                        value={quantity}
                        type="text"
                        min="1"
                        className="menu-item-modal-quantity-input"
                        onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    />
                    <Button
                        onClick={handleIncreaseQuantity}
                        className="menu-item-modal-quantity-buttons"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
                <Button
                    variant="danger"
                    className={`rounded-pill`}
                    onClick={handleAddToCart}
                >
                    Add to cart - ${(menuItem.price * quantity).toFixed(2)}
                </Button>
            </Modal.Footer>

        </Modal>
    )
};
export default MenuItemModal;