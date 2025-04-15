import { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card, Image } from "react-bootstrap";
import { useCreateDishMutation } from "../../services/dishApi";
import { RootState } from "../../services/store";
import { RestaurantType } from "../../services/restaurantApi";
import { useSelector } from "react-redux";
import { AlertType } from "../../util/components/CustomAlert";
import CustomAlert from "../../util/components/CustomAlert";
const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/drxzjafvf/image/upload";


const AddDishPage = () => {

    const restaurant = useSelector<RootState, RestaurantType | null>(
        (state) => state.auth.restaurant
    );

    const [createDish, { isLoading }] = useCreateDishMutation();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [alertConfig, setAlertConfig] = useState({
        show: false,
        message: "",
        type: "success" as AlertType,
    });
    const showAlert = (message: string, type: AlertType) => {
        setAlertConfig({
            show: true,
            message,
            type
        });
    };
    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, show: false }));
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "restaurantbanner"); // Cloudinary preset

        try {
            const res = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: data,
            });

            const result = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
            console.log("Image uploaded:", result.secure_url);
        } catch (error) {
            console.error("Upload failed:", error);
            showAlert("Image upload failed. Please try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!restaurant?.id) {
            showAlert("Restaurant not found. Please log in.", "error");
            return;
        }
        try {
            await createDish({
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                imageUrl: formData.imageUrl,
                restaurantId: restaurant?.id ?? "",
            }).unwrap();

            setFormData({
                name: '',
                price: '',
                description: '',
                imageUrl: '',
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            showAlert('Dish added successfully!', 'success');
        } catch (err) {
            console.error('Failed to add dish:', err);
            showAlert('Failed to add dish. Please try again.', 'error');
        }
    };

    return (
        <>
            <CustomAlert
                show={alertConfig.show}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={closeAlert}
            />
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm py-4">
                            <Card.Header className="bg-white border-0 mb-2">
                                <h4 className="mb-0 fw-bold">Add New Menu Item</h4>
                            </Card.Header>

                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={formData.imageUrl ? 6 : 12}>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Dish Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Price ($)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="Describe your dish..."
                                                    rows={3}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Upload Dish Image</Form.Label>
                                                <Form.Control
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                                {uploading && (
                                                    <div className="upload-indicator">
                                                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                                                        <span>Uploading image...</span>
                                                    </div>
                                                )}
                                                {formData.imageUrl && !uploading && (
                                                    <div className="text-success mt-1">
                                                        <small>✓ Image uploaded successfully</small>
                                                    </div>
                                                )}
                                            </Form.Group>

                                        </Col>

                                        {formData.imageUrl && (
                                            <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="text-center mb-2">Preview</div>
                                                <div className="border rounded p-2 bg-light text-center" style={{ width: '100%', height: '250px' }}>
                                                    <Image
                                                        src={formData.imageUrl}
                                                        alt="Dish preview"
                                                        style={{ maxWidth: '100%', maxHeight: '230px', objectFit: 'contain' }}
                                                        onError={(e: any) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/placeholder-dish.jpg';
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                    </Row>

                                    <div className="d-flex justify-content-end mt-4">
                                        <Button
                                            variant="outline-secondary"
                                            className="me-2 rounded-pill"
                                            type="reset"
                                            onClick={() => {
                                                setFormData({
                                                    name: '',
                                                    price: '',
                                                    description: '',
                                                    imageUrl: '',
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="danger"
                                            type="submit"
                                            disabled={isLoading || uploading}
                                            className="rounded-pill"
                                        >
                                            {isLoading ? 'Adding...' : 'Add Dish'}
                                        </Button>
                                    </div>

                                </Form>
                            </Card.Body>

                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default AddDishPage;


