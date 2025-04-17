import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faUser, faCalendarAlt, faLock } from '@fortawesome/free-solid-svg-icons';
import { PaymentInfoType } from '../../services/customerApi';
import styles from './AddPaymentModal.module.css';

interface AddPaymentModalProps {
    show: boolean;
    handleClose: () => void;
    onAddPayment: (paymentInfo: PaymentInfoType) => Promise<void>;
    isLoading: boolean;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
    show,
    handleClose,
    onAddPayment,
    isLoading
}) => {
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfoType>({
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: ''
    });
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (cleaned.length <= 16) {
                const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
                setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
            }
            return;
        }

        // Format expiration date as MM/YY
        if (name === 'expirationDate') {
            const cleaned = value.replace(/[^0-9]/gi, '');
            if (cleaned.length <= 4) {
                let formatted = cleaned;
                if (cleaned.length > 2) {
                    formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
                }
                setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
            }
            return;
        }

        // Limit CVV to 3-4 digits
        if (name === 'cvv') {
            const cleaned = value.replace(/[^0-9]/gi, '');
            if (cleaned.length <= 4) {
                setPaymentInfo(prev => ({ ...prev, [name]: cleaned }));
            }
            return;
        }

        setPaymentInfo(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {
            cardNumber: '',
            cardHolderName: '',
            expirationDate: '',
            cvv: ''
        };
        let isValid = true;

        // Validate card number (should be 16 digits)
        const cardNumberClean = paymentInfo.cardNumber.replace(/\s+/g, '');
        if (!cardNumberClean || cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
            isValid = false;
        }

        // Validate cardholder name
        if (!paymentInfo.cardHolderName.trim()) {
            newErrors.cardHolderName = 'Please enter the cardholder name';
            isValid = false;
        }

        // Validate expiration date (MM/YY format)
        if (!paymentInfo.expirationDate || !paymentInfo.expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            newErrors.expirationDate = 'Please enter a valid expiration date (MM/YY)';
            isValid = false;
        } else {
            // Check if the card is expired
            const [month, year] = paymentInfo.expirationDate.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
            const currentDate = new Date();
            if (expiryDate < currentDate) {
                newErrors.expirationDate = 'This card has expired';
                isValid = false;
            }
        }

        // Validate CVV (3-4 digits)
        if (!paymentInfo.cvv || !(paymentInfo.cvv.length >= 3 && paymentInfo.cvv.length <= 4) || !/^\d+$/.test(paymentInfo.cvv)) {
            newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidated(true);

        if (validateForm()) {
            try {
                await onAddPayment(paymentInfo);
                // Reset form after successful submission
                setPaymentInfo({
                    cardNumber: '',
                    cardHolderName: '',
                    expirationDate: '',
                    cvv: ''
                });
                setValidated(false);
                handleClose();
            } catch (error) {
                console.error('Error adding payment method:', error);
            }
        }
    };

    const handleModalHide = () => {
        setPaymentInfo({
            cardNumber: '',
            cardHolderName: '',
            expirationDate: '',
            cvv: ''
        });
        setValidated(false);
        setErrors({
            cardNumber: '',
            cardHolderName: '',
            expirationDate: '',
            cvv: ''
        });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalHide} centered>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className="fw-bold">Add Payment Method</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-3">
                    <div className={styles.cardPreview}>
                        <div className={styles.cardInner}>
                            <div className={styles.cardChip}></div>
                            <div className={styles.cardNumber}>
                                {paymentInfo.cardNumber || '•••• •••• •••• ••••'}
                            </div>
                            <div className={styles.cardDetails}>
                                <div className={styles.cardHolder}>
                                    <div className={styles.cardLabel}>Card Holder</div>
                                    <div>{paymentInfo.cardHolderName || 'YOUR NAME'}</div>
                                </div>
                                <div className={styles.cardExpiry}>
                                    <div className={styles.cardLabel}>Expires</div>
                                    <div>{paymentInfo.expirationDate || 'MM/YY'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Form.Group className="mb-3" controlId="cardNumber">
                        <Form.Label className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faCreditCard} className="me-2 text-secondary" />
                            <span>Card Number</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            className={styles.formControl}
                            isInvalid={!!errors.cardNumber}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.cardNumber}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="cardHolderName">
                        <Form.Label className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" />
                            <span>Cardholder Name</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="cardHolderName"
                            value={paymentInfo.cardHolderName}
                            onChange={handleChange}
                            placeholder="Name as it appears on card"
                            className={styles.formControl}
                            isInvalid={!!errors.cardHolderName}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.cardHolderName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="expirationDate">
                                <Form.Label className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-secondary" />
                                    <span>Expiration Date</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="expirationDate"
                                    value={paymentInfo.expirationDate}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    className={styles.formControl}
                                    isInvalid={!!errors.expirationDate}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.expirationDate}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="cvv">
                                <Form.Label className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faLock} className="me-2 text-secondary" />
                                    <span>CVV</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="cvv"
                                    value={paymentInfo.cvv}
                                    onChange={handleChange}
                                    placeholder="123"
                                    className={styles.formControl}
                                    isInvalid={!!errors.cvv}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.cvv}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button
                        variant="outline-secondary"
                        className={styles.cancelButton}
                        onClick={handleModalHide}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        className={styles.saveButton}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Adding...
                            </>
                        ) : (
                            'Add Payment Method'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddPaymentModal;