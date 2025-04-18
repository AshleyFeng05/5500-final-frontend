import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import StarRating from "../../util/components/StarRating";

import { useGetDishesByRestaurantIdQuery } from "../../services/dishApi";
import { useGetRestaurantByIdQuery } from "../../services/restaurantApi";

import styles from "./RestaurantMenu.module.css";

const RestaurantMenu = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const dispatch = useDispatch();


    const { data: restaurant, isLoading: isLoadingRestaurant, isError: isErrorRestaurant } = useGetRestaurantByIdQuery(restaurantId || "");
    const { data: dishes, isLoading: isLoadingDishes, isError: isErrorDishes } = useGetDishesByRestaurantIdQuery(restaurantId || "");

    const [searchTerm, setSearchTerm] = useState("");

    if (!restaurantId) {
        return <div>Missing Restaurant ID</div>;
    }
    if (isLoadingRestaurant || isLoadingDishes) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading restaurant menu...</p>
            </Container>
        );
    }
    if (isErrorRestaurant || isErrorDishes) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-danger mb-3">Unable to load restaurant menu</h3>
                {isErrorRestaurant && <p>Error loading restaurant</p>}
                {isErrorDishes && <p>Error loading dishes</p>}
            </Container>
        );
    }
    if (!restaurant) {
        return <div>Restaurant not found</div>;
    }
    if (!dishes) {
        return <div>No dishes found for this restaurant</div>;
    }
    const filteredDishes = dishes?.filter((dish) =>
        dish.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );




    return (
        <div className={styles.menuPage}>

            {/* Restaurant Banner */}
            <div className={`${styles.bannerContainer} rounded-bottom-4 mb-4 overflow-hidden position-relative`}>
                <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className={`${styles.bannerImage}`}
                />
                {restaurant.logoUrl && (
                    <div className={`${styles.logoContainer} position-absolute rounded-circle`}>
                        <img
                            src={restaurant.logoUrl}
                            alt={`${restaurant.name} logo`}
                            className={`${styles.logoImage} rounded-circle`}
                        />
                    </div>
                )}
            </div>

            <Container className={`${styles.menuContainer}`}>
                <Row className="align-items-center">
                    <Col lg={7}>
                        <div>
                            <div className="d-flex align-items-center">
                                <h1 className={styles.restaurantName}>{restaurant.name}</h1>
                            </div>
                            <div className={`${styles.restaurantDetails} d-flex align-items-center`}>
                                <StarRating
                                    rating={restaurant.rating || 0}
                                    numberOfRatings={restaurant.numberOfRatings}
                                />
                                <span className={styles.dot}>•</span>
                                <span>{restaurant.address}</span>
                            </div>
                        </div>

                    </Col>
                    <Col lg={5}>
                        <div className={styles.searchContainer}>
                            <div className={styles.searchBar}>
                                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search for dishes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                <div className={`py-4`}>
                    {filteredDishes.length > 0 ? (
                        <Row className="gy-4">
                            {filteredDishes.map((dish) => (
                                <Col xs={12} sm={6} lg={4} xl={3} key={dish.id}>
                                    <Card className={`${styles.dishCard} rounded-4 border-0`}>
                                        <div className={styles.dishContent}>
                                            <div className={styles.dishImageWrapper}>
                                                <img
                                                    src={dish.imageUrl}
                                                    alt={dish.name}
                                                    className={styles.dishImage}
                                                />
                                                <Button
                                                    variant="light"
                                                    className={`${styles.addButton} rounded-circle`}
                                                    onClick={() => {
                                                        //TODO
                                                        console.log("Add to cart", dish);
                                                    }}
                                                >
                                                    <span className={styles.plusIcon}>+</span>
                                                </Button>
                                            </div>
                                            <div className={styles.dishInfo}>
                                                <h3 className={styles.dishName}>{dish.name}</h3>
                                                <div className={styles.dishMeta}>
                                                    <span className={styles.dishPrice}>${dish.price?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className={styles.emptyResults}>
                            <p>No dishes match your search for "{searchTerm}"</p>
                            <Button variant="outline-danger"
                                onClick={() => setSearchTerm("")}>
                                Clear Search
                            </Button>
                        </div>
                    )}
                </div>

            </Container>


        </div>
    );
}
export default RestaurantMenu;