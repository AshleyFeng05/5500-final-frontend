
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { RestaurantType } from "../../services/restaurantApi";

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

        const res = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: data,
        });

        const result = await res.json();
        setFormData(prev => ({ ...prev, [type]: result.secure_url }));
        console.log(result.secure_url);
        type === "imageUrl" ? setUploadingBanner(false) : setUploadingLogo(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Account Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control name="address" value={formData.address} onChange={handleChange} />
                    </Form.Group>
                    {/* Upload Banner Image */}
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Banner Image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "imageUrl")} />
                        {uploadingBanner && <div className="text-secondary mt-1">Uploading banner...</div>}
                        {formData.imageUrl && (
                            <img
                                src={formData.imageUrl}
                                alt="Banner Preview"
                                className="img-fluid rounded mt-2"
                                style={{ maxHeight: "200px" }}
                            />
                        )}
                    </Form.Group>

                    {/* Upload Logo Image */}
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Logo Image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logoUrl")} />
                        {uploadingLogo && <div className="text-secondary mt-1">Uploading logo...</div>}
                        {formData.logoUrl && (
                            <img
                                src={formData.logoUrl}
                                alt="Logo Preview"
                                className="img-thumbnail mt-2"
                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="rounded-pill" onClick={handleClose}>Cancel</Button>
                    <Button variant="danger" className="rounded-pill" type="submit">Save Changes</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );

}
export default EditAccountModal;