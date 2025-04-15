import { RootState } from "../../services/store"
import { useSelector } from "react-redux"
import { Container, Row, Col, Card, Spinner, Button, Modal, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RestaurantType } from "../../services/restaurantApi"
import styles from "./RestaurantMenu.module.css";
import { useRef, useState } from "react";
import { useGetDishesByRestaurantIdQuery, useDeleteDishMutation, useUpdateDishMutation } from "../../services/dishApi"

const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/drxzjafvf/image/upload";

const RestaurantMenu = () => {
    const restaurant = useSelector<RootState, RestaurantType | null>(
        (state) => state.auth.restaurant
    )

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dishToDelete, setDishToDelete] = useState<string | null>(null);

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: "",
        name: "",
        price: "",
        description: "",
        imageUrl: "",
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        data: dishes,
        isLoading,
        isError,
        refetch
    } = useGetDishesByRestaurantIdQuery(restaurant?.id || "", {
        skip: !restaurant?.id
    });

    const [deleteDish, { isLoading: isDeleting }] = useDeleteDishMutation();
    const [updateDish, { isLoading: isUpdating }] = useUpdateDishMutation();

    if (!restaurant?.id) {
        return (
            <Container className="py-5 text-center">
                <h3>Please log in to view your menu</h3>
            </Container>
        );
    }
    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading menu items...</p>
            </Container>
        );
    }
    if (isError) {
        return (
            <Container className="py-5 text-center">
                <div className="alert alert-danger">
                    Error loading menu items.
                    <Button variant="link" onClick={() => refetch()} className="text-danger">
                        Try again
                    </Button>
                </div>
            </Container>
        );
    }

    const handleEditDish = (dishId: string) => {
        // Find the dish to edit
        const dishToEdit = dishes?.find(dish => dish.id === dishId);
        if (dishToEdit) {
            // Populate the form data
            setEditFormData({
                id: dishToEdit.id,
                name: dishToEdit.name,
                price: dishToEdit.price.toString(),
                description: dishToEdit.description,
                imageUrl: dishToEdit.imageUrl,
            });
            setShowEditModal(true);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
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
            setEditFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
            console.log("Image uploaded:", result.secure_url);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateDish({
                id: editFormData.id,
                name: editFormData.name,
                price: parseFloat(editFormData.price),
                description: editFormData.description,
                imageUrl: editFormData.imageUrl,
                restaurantId: restaurant.id,
            }).unwrap();

            setShowEditModal(false);
            refetch(); // Refresh the dish list
            alert('Dish updated successfully!');
        } catch (error) {
            console.error("Failed to update dish:", error);
            alert("Failed to update dish. Please try again.");
        }
    };

    const handleDeleteConfirmation = (dishId: string) => {
        setDishToDelete(dishId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (dishToDelete) {
            try {
                await deleteDish(dishToDelete).unwrap();
                setShowDeleteModal(false);
                refetch(); // Refresh the dish list after deletion
            } catch (error) {
                console.error("Failed to delete dish:", error);
                alert("Failed to delete dish. Please try again.");
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDishToDelete(null);
    };

    return (
        <>
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Restaurant Menu</h2>
                    <Link to="/restaurant/dashboard/add-items">
                        <Button
                            variant="danger"
                            className="rounded-pill"
                        >
                            Add New Item
                        </Button>
                    </Link>
                </div>

                {!dishes || dishes.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="mb-3">Your menu is empty. Add your first dish to get started.</p>
                        <Link to="/restaurant/dashboard/add-items">
                            <Button
                                variant="danger"
                                className="rounded-pill"
                            >
                                Add Your First Dish
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Row className="g-4">
                        {dishes.map((dish) => (
                            <Col key={dish.id.toString()} xs={12} md={6} lg={4}>
                                <Card className={styles.dishCard}>
                                    <div className={styles.imageContainer}>
                                        <Card.Img
                                            variant="top"
                                            src={dish.imageUrl}
                                            className={styles.dishImage}
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-dish.jpg';
                                            }}
                                        />
                                    </div>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <Card.Title className={styles.dishTitle}>{dish.name}</Card.Title>
                                            <span className={styles.dishPrice}>${dish.price.toFixed(2)}</span>
                                        </div>
                                        <Card.Text className={styles.dishDescription}>
                                            {dish.description}
                                        </Card.Text>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className={`${styles.actionBtn} rounded-pill`}
                                                onClick={() => handleEditDish(dish.id)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className={`${styles.actionBtn} ms-2 rounded-pill`}
                                                onClick={() => handleDeleteConfirmation(dish.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={cancelDelete} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this menu item? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelDelete}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Item'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Dish Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Menu Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Row>
                                <Col md={editFormData.imageUrl ? 6 : 12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Dish Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Price ($)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={editFormData.price}
                                            onChange={handleEditFormChange}
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
                                            value={editFormData.description}
                                            onChange={handleEditFormChange}
                                            rows={3}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Change Dish Image</Form.Label>
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
                                        {editFormData.imageUrl && !uploading && (
                                            <div className="text-success mt-1">
                                                <small>✓ Image ready</small>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                {editFormData.imageUrl && (
                                    <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
                                        <div className="text-center mb-2">Preview</div>
                                        <div className="border rounded p-2 bg-light text-center" style={{ width: '100%', height: '250px' }}>
                                            <Image
                                                src={editFormData.imageUrl}
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
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    type="submit"
                                    disabled={isUpdating || uploading}
                                    className="rounded-pill"
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    )
}

export default RestaurantMenu