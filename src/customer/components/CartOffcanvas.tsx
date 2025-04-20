import { Offcanvas, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../services/store";
import { removeFromCart, addToCart, selectCartTotalItems, selectCartTotalPrice } from "../../services/cartSlice";
import "./CartOffcanvas.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { DishType } from "../../services/dishApi";
import { useNavigate } from "react-router-dom";

interface CartOffcanvasProps {
    show: boolean;
    onHide: () => void;
}

const CartOffcanvas = ({ show, onHide }: CartOffcanvasProps) => {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const totalItems = useSelector(selectCartTotalItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const navigate = useNavigate();

    const handleIncreaseQuantity = (dish: DishType) => {
        dispatch(addToCart({ dish, quantity: 1 }));
    };
    const handleDecreaseQuantity = (dishId: string) => {
        dispatch(removeFromCart({ dishId, quantity: 1 }));
    };
    const handleCheckout = () => {
        onHide();
        navigate("/checkout");
    }

    if (cart.items.length === 0) {
        return (
            <Offcanvas show={show} onHide={onHide} placement="end" className="cart-offcanvas">
                <Offcanvas.Header closeButton className="cart-header">
                    <Offcanvas.Title>Your Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="cart-body-empty">
                    <div className="cart-empty">
                        <div className="cart-empty-icon">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </div>
                        <h4>Your cart is empty</h4>
                        <p>Add items from a restaurant to get started</p>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        );
    }

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="cart-offcanvas">
            <Offcanvas.Header closeButton className="cart-header">
                <Offcanvas.Title>Your Cart</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className="cart-body p-0">
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item.dish.id} className="cart-item">
                            <div className="cart-item-image-container">
                                <img
                                    src={item.dish.imageUrl}
                                    alt={item.dish.name}
                                    className="cart-item-image"
                                />
                            </div>
                            <div className="cart-item-info">
                                <div className="cart-item-name">{item.dish.name}</div>
                                <div className="cart-item-price">${(item.dish.price * item.quantity).toFixed(2)}</div>
                            </div>
                            <div className="cart-item-quantity-control">
                                <button
                                    className="cart-quantity-btn"
                                    onClick={() => handleDecreaseQuantity(item.dish.id)}
                                >
                                    {item.quantity === 1 ? (
                                        <FontAwesomeIcon icon={faTrash} />
                                    ) : (
                                        <FontAwesomeIcon icon={faMinus} />
                                    )}
                                </button>
                                <span className="cart-quantity-value">{item.quantity}</span>
                                <button
                                    className="cart-quantity-btn"
                                    onClick={() => handleIncreaseQuantity(item.dish)}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-checkout-container">
                    <Button
                        variant="danger"
                        className="cart-checkout-btn rounded-pill"
                        onClick={handleCheckout}
                        disabled={cart.items.length === 0}
                    >
                        Go to Checkout • ${totalPrice.toFixed(2)}
                    </Button>
                </div>

            </Offcanvas.Body>

        </Offcanvas >
    );
};

export default CartOffcanvas;