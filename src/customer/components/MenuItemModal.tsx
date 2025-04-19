import { DishType } from "../../services/dishApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../services/cartSlice";
import { Modal, Button, Image, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./MenuItemModal.module.css";

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

                <div className={styles.dishInfo}>
                    <h3 className={`fw-bold mb-2`}>{menuItem.name}</h3>

                    <div className={`${styles.dishPrice} mb-2`}>${menuItem.price.toFixed(2)}</div>
                    {menuItem.description && (
                        <div className={styles.dishDescription}>
                            {menuItem.description}
                        </div>
                    )}

                </div>
                <div className={styles.imageContainer}>
                    <Image
                        src={menuItem.imageUrl}
                        alt={menuItem.name}
                        className={styles.dishImage}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <div className={styles.quantityContainer}>
                    <Button
                        variant="link"
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        className={styles.quantityButton}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Form.Control
                        value={quantity}
                        type="text"
                        min="1"
                        className={styles.quantityInput}
                        onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    />
                    <Button
                        variant="link"
                        onClick={handleIncreaseQuantity}
                        className={styles.quantityButton}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
                <Button
                    variant="danger"
                    className={`rounded-pill ${styles.addToCartButton}`}
                    onClick={handleAddToCart}
                >
                    Add to cart - ${(menuItem.price * quantity).toFixed(2)}
                </Button>
            </Modal.Footer>

        </Modal>
    )
};
export default MenuItemModal;