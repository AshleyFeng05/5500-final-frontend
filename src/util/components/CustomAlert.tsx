import { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationTriangle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';


export type AlertType = "success" | "error" | "warning";

interface CustomAlertProps {
    message: string;
    type: AlertType;
    show: boolean;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

const CustomAlert = ({
    message, type, show, onClose, autoClose = true, duration = 3000
}: CustomAlertProps) => {

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (show && autoClose) {
            timer = setTimeout(() => {
                onClose();
            }, duration)
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [show, autoClose, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success": return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
            case "error": return <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />;
            case "warning": return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />;
        }
    }

    return (
        <ToastContainer position="top-center" className="p-3" style={{ zIndex: 1070 }}>
            <Toast show={show} onClose={onClose}
                bg={type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'danger'}
                className="rounded-3 border-0"
            >
                <Toast.Header className="border-0" closeButton={false}>
                    {getIcon()}
                    <strong className="me-auto">
                        {type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Error'}
                    </strong>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                </Toast.Header>
                <Toast.Body className={type === 'error' || type === 'success' ? 'text-white' : ''}>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )

}
export default CustomAlert;