import { useState } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import { RestaurantType } from "../../services/restaurantApi";
import styles from "./EditAccountModal.module.css";

const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/drxzjafvf/image/upload";

type EditAccountModalProps = {
    show: boolean;
    handleClose: () => void;
    restaurant: RestaurantType;
    onSave: (updated: Partial<RestaurantType>) => void;
};

const EditAccountModal = ({ show, handleClose, restaurant, onSave }: EditAccountModalProps) => {
    const [formData, setFormData] = useState({
        name: restaurant.name,
        email: restaurant.email,
        phone: restaurant.phone,
        address: restaurant.address,
        imageUrl: restaurant.imageUrl,
        logoUrl: restaurant.logoUrl,
    });
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<any>, type: "imageUrl" | "logoUrl") => {
        const file = e.target.files?.[0];
        if (!file) return;
        type === "imageUrl" ? setUploadingBanner(true) : setUploadingLogo(true);

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "restaurantbanner"); // Cloudinary preset

        try {
            const res = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: data,
            });

            const result = await res.json();
            setFormData(prev => ({ ...prev, [type]: result.secure_url }));
            console.log(result.secure_url);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed. Please try again.");
        } finally {
            type === "imageUrl" ? setUploadingBanner(false) : setUploadingLogo(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="modal-lg">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className="fw-bold">Edit Account Info</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-3">
                    <Row>
                        <Col md={formData.imageUrl ? 6 : 12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Restaurant Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.formControl}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.formControl}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Phone</Form.Label>
                                <Form.Control
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.formControl}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Address</Form.Label>
                                <Form.Control
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={styles.formControl}
                                />
                            </Form.Group>
                        </Col>

                        {formData.imageUrl && (
                            <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
                                <div className="text-center mb-2">Banner Preview</div>
                                <div className={styles.previewContainer}>
                                    <Image
                                        src={formData.imageUrl}
                                        alt="Banner Preview"
                                        className={styles.bannerPreview}
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-banner.jpg';
                                        }}
                                    />
                                </div>
                            </Col>
                        )}
                    </Row>

                    <Row className="mt-3">
                        <Col xs={12} md={formData.logoUrl ? 6 : 12}>
                            {/* Upload Banner Image */}
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Upload Banner Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "imageUrl")}
                                    className={styles.formControl}
                                />
                                {uploadingBanner && (
                                    <div className="upload-indicator">
                                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                                        <span>Uploading banner...</span>
                                    </div>
                                )}
                                {formData.imageUrl && !uploadingBanner && (
                                    <div className="text-success mt-1">
                                        <small>✓ Banner image uploaded</small>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={formData.logoUrl ? 6 : 12}>
                            {/* Upload Logo Image */}
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Upload Logo Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "logoUrl")}
                                    className={styles.formControl}
                                />
                                {uploadingLogo && (
                                    <div className="upload-indicator">
                                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                                        <span>Uploading logo...</span>
                                    </div>
                                )}
                                {formData.logoUrl && !uploadingLogo && (
                                    <div className="text-success mt-1">
                                        <small>✓ Logo image uploaded</small>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    {formData.logoUrl && (
                        <div className="text-center mt-3">
                            <div className="text-center mb-2">Logo Preview</div>
                            <div className={styles.logoPreviewContainer}>
                                <Image
                                    src={formData.logoUrl}
                                    alt="Logo Preview"
                                    className={styles.logoPreview}
                                    onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-logo.jpg';
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button
                        variant="outline-secondary"
                        className={`${styles.cancelButton} rounded-pill`}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        className={`${styles.saveButton} rounded-pill`}
                        type="submit"
                        disabled={uploadingBanner || uploadingLogo}
                    >
                        {(uploadingBanner || uploadingLogo) ? 'Uploading...' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EditAccountModal;