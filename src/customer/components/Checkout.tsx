import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faCreditCard,
    faPlus,
    faChevronRight,
    faChevronLeft,
    faClock,
    faCheckCircle,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { RootState } from "../../services/store";
import { setCustomer } from "../../services/authSlice";
import { CartItemType, selectCartTotalPrice, clearCart } from "../../services/cartSlice";
import { CustomerType, PaymentInfoType } from "../../services/customerApi";
import { useUpdateInfoMutation, useAddPaymentInfoMutation } from "../../services/customerApi";
import AddPaymentModal from "./AddPaymentModal";
import CustomAlert from "../../util/components/CustomAlert";
import { useCreateOrderMutation, OrderStatus } from "../../services/orderApi";

import "./Checkout.css";

const Checkout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector<RootState, CartItemType[]>((state) => state.cart.items);
    const restaurantId = useSelector<RootState, string | null>((state) => state.cart.restaurantId);
    const cartTotal = useSelector(selectCartTotalPrice);
    const customer = useSelector<RootState, CustomerType | null>((state) => state.auth.customer);

    const [updateCustomerInfo] = useUpdateInfoMutation();
    const [addPaymentInfo, { isLoading: isAddingPayment }] = useAddPaymentInfoMutation();
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

    const [selectedPayment, setSelectedPayment] = useState<PaymentInfoType | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [tipAmount, setTipAmount] = useState<number>(0);

    const presetTips = [2, 3, 5, 10];


    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error" | "warning"
    });

    const deliveryFee = 3.99;
    const serviceFee = (cartTotal * 0.10).toFixed(2);
    const taxAmount = (cartTotal * 0.0825).toFixed(2);

    const totalWithFees = cartTotal + deliveryFee + parseFloat(serviceFee) + parseFloat(taxAmount) + (tipAmount || 0);

    useEffect(() => {
        if (customer?.address) {
            setDeliveryAddress(customer.address);
        }

        if (customer?.paymentInfo && customer.paymentInfo.length > 0) {
            setSelectedPayment(customer.paymentInfo[0]);
        }
    }, [customer]);

    useEffect(() => {
        if (cartItems.length === 0 && !isCreatingOrder) {
            navigate('/dashboard'); // Redirect if cart is empty
        }
    }, [cartItems, navigate, isCreatingOrder]);

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, show: false }));
    };

    const formatCardNumber = (cardNumber: string) => {
        return '•••• ' + cardNumber.slice(-4);
    };

    const handleAddPayment = async (paymentInfo: PaymentInfoType) => {
        if (!customer?.id) {
            setAlert({ show: true, message: "Please log in to add payment method.", type: "error" });
            return;
        }
        try {
            const response = await addPaymentInfo({ customerId: customer.id, paymentInfo: paymentInfo }).unwrap();
            if (response) {
                setSelectedPayment(paymentInfo);
                setAlert({ show: true, message: "Payment method added successfully.", type: "success" });
                dispatch(setCustomer(response));
            }
            setShowAddPaymentModal(false);
        } catch (error) {
            console.error("Error adding payment info:", error);
            setAlert({ show: true, message: "Failed to add payment method. Please try again.", type: "error" });
        }
    };

    const handleSaveAddress = async () => {
        if (!customer?.id) {
            setAlert({ show: true, message: "Please log in to save your address.", type: "error" });
            return;
        }
        try {
            const response = await updateCustomerInfo({
                customerId: customer.id,
                customer: { ...customer, address: newAddress }
            }).unwrap();
            if (response) {
                setDeliveryAddress(newAddress);
                setAlert({ show: true, message: "Address updated successfully.", type: "success" });
                dispatch(setCustomer(response));
            }
            setShowAddressForm(false);
        } catch (error) {
            console.error("Error updating customer info:", error);
            setAlert({ show: true, message: "Failed to save address. Please try again.", type: "error" });
        }
    };


    const handlePlaceOrder = async () => {
        if (!customer?.id) {
            setAlert({ show: true, message: "Please log in to place an order.", type: "error" });
            return;
        }
        if (!deliveryAddress) {
            setAlert({ show: true, message: "Please enter a delivery address.", type: "warning" });
            return;
        }
        if (!selectedPayment) {
            setAlert({ show: true, message: "Please add a payment method.", type: "warning" });
            return;
        }
        if (!restaurantId) {
            setAlert({ show: true, message: "Restaurant is missing from your cart.", type: "error" });
            return;
        }

        try {
            const orderData = {
                customerId: customer.id,
                deliveryAddress: deliveryAddress,

                restaurantId: restaurantId,


                dasherId: undefined,
                dasherName: undefined,

                totalPrice: totalWithFees,
                items: cartItems.map((item) => ({
                    dishId: item.dish.id,
                    dishName: item.dish.name,
                    quantity: item.quantity
                })),
                payment: selectedPayment,
            }
            const response = await createOrder(orderData).unwrap();
            if (response) {
                dispatch(clearCart());
                navigate(`/orders/${response.id}`, {
                    state: {
                        success: true,
                        message: "Your order has been placed successfully!"
                    }
                });
            }

        } catch (error) {
            console.error("Failed to place order: ", error);
            setAlert({ show: true, message: "Failed to place order. Please try again.", type: "error" });
        }
    }

    if (!customer) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-muted">Please log in to checkout</h3>
            </Container>
        );
    }


    return (
        <Container className="py-4 checkout-page">
            <CustomAlert
                show={alert.show}
                onClose={handleCloseAlert}
                type={alert.type}
                message={alert.message}
            />

            <AddPaymentModal
                show={showAddPaymentModal}
                handleClose={() => setShowAddPaymentModal(false)}
                onAddPayment={handleAddPayment}
                isLoading={isAddingPayment}
            />


            <h1 className="fw-bold mb-4">Checkout</h1>

            <Row>
                <Col lg={8}>
                    <Card className="mb-4 shadow-sm rounded-3">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center rounded-top-3">
                            <h3 className="fs-5 fw-bold mb-0">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-danger" />
                                Delivery Address
                            </h3>
                            {deliveryAddress && !showAddressForm && (
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="rounded-pill px-3"
                                    onClick={() => setShowAddressForm(true)}
                                >
                                    Change
                                </Button>
                            )}
                        </Card.Header>

                        <Card.Body className="p-4">
                            {showAddressForm ? (
                                <div>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your full address"
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                            className="mb-3"
                                        />
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="danger"
                                                onClick={handleSaveAddress}
                                                className="rounded-pill px-4"
                                            >
                                                Save Address
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => setShowAddressForm(false)}
                                                className="rounded-pill px-3"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </div>
                            ) : deliveryAddress ? (
                                <div className="d-flex align-items-center">
                                    <div className="me-3 p-3 bg-light rounded-circle icon-circle">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    </div>
                                    <div>
                                        <p className="mb-1 fw-bold">Deliver to:</p>
                                        <p className="mb-0">{deliveryAddress}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <p className="mb-3">No delivery address set</p>
                                    <Button
                                        variant="danger"
                                        className="rounded-pill px-4"
                                        onClick={() => setShowAddressForm(true)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                                        Add Address
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 shadow-sm rounded-3">
                        <Card.Header className="bg-white py-3 rounded-top-3">
                            <h3 className="fs-5 fw-bold mb-0">
                                <FontAwesomeIcon icon={faCreditCard} className="me-2 text-danger" />
                                Payment Method
                            </h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {customer.paymentInfo && customer.paymentInfo.length > 0 ? (
                                <div>
                                    <div className="mb-3">
                                        {customer.paymentInfo.map((payment, index) => (
                                            <div
                                                key={index}
                                                className={`
                                                    border rounded-3 p-3 mb-2 d-flex align-items-center
                                                    ${selectedPayment === payment ? 'border-danger' : ''}
                                                `}
                                                onClick={() => setSelectedPayment(payment)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className={`
                                                    form-check me-2
                                                    ${selectedPayment === payment ? 'text-danger' : ''}
                                                `}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentMethod"
                                                        checked={selectedPayment === payment}
                                                        onChange={() => setSelectedPayment(payment)}
                                                    />
                                                </div>
                                                <div className="me-3 p-3 bg-light rounded-circle icon-circle">
                                                    <FontAwesomeIcon icon={faCreditCard} />
                                                </div>
                                                <div>
                                                    <p className="mb-1 fw-bold">{payment.cardHolderName}</p>
                                                    <p className="mb-0 text-muted small">
                                                        {formatCardNumber(payment.cardNumber)} • Expires {payment.expirationDate}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        className="rounded-pill px-4"
                                        onClick={() => setShowAddPaymentModal(true)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                                        Add New Payment Method
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <p className="mb-3">No payment methods available</p>
                                    <Button
                                        variant="danger"
                                        className="rounded-pill px-4"
                                        onClick={() => setShowAddPaymentModal(true)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                                        Add Payment Method
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm rounded-3 sticky-top">
                        <Card.Header className="bg-white py-3" style={{ top: '20px' }}>
                            <h3 className="fs-5 fw-bold mb-0">Order Summary</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2">
                                        <div>
                                            <span className="fw-bold me-2">{item.quantity}x</span>
                                            {item.dish.name}
                                        </div>
                                        <div>${(item.dish.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-3" />

                            {/* Tip */}
                            <div className="mb-4">
                                <p className="fw-bold mb-2">Add a tip:</p>
                                <div className="d-flex gap-2 mb-3">
                                    {presetTips.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant={tipAmount === amount ? "danger" : "outline-secondary"}
                                            className="flex-grow-1"
                                            onClick={() => setTipAmount(amount)}
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <Form.Control
                                        type="number"
                                        placeholder="Custom amount"
                                        value={tipAmount}
                                        onChange={(e) => setTipAmount(parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="mb-1">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Delivery Fee</span>
                                    <span>${deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Service Fee</span>
                                    <span>${serviceFee}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tax</span>
                                    <span>${taxAmount}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tip</span>
                                    <span>${tipAmount!.toFixed(2)}</span>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold">${totalWithFees.toFixed(2)}</span>
                            </div>

                            <Button
                                variant="danger"
                                className="w-100 rounded-pill mb-3"
                                onClick={handlePlaceOrder}
                                disabled={
                                    isCreatingOrder ||
                                    !deliveryAddress ||
                                    !selectedPayment ||
                                    cartItems.length === 0
                                }
                            >
                                {isCreatingOrder ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                className="w-100 py-1 rounded-pill"
                                onClick={() => navigate(-1)}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
                                Back to Restaurant
                            </Button>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </Container>
    )
}
export default Checkout;