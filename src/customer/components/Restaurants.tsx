import React, { useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useGetAllRestaurantsQuery } from '../../services/restaurantApi';
import RestaurantCard from '../../util/components/RestaurantCard';
import styles from "./Restaurants.module.css"


const Restaurants: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: restaurants, isLoading, error } = useGetAllRestaurantsQuery();

    // Filter restaurants based on search term
    const filteredRestaurants = restaurants?.filter((restaurant) =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-3">Loading restaurants...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5 text-center">
                <h3 className="text-danger mb-3">Unable to load restaurants</h3>
                <p>Please try again later or contact support if the problem persists.</p>
            </Container>
        );
    }

    return (
        <>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="mb-4 fw-bold">Restaurants Near You</h2>
            </div>

            <div className={styles.searchContainer}>
                <div className={styles.searchBar}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search for restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>


            {
                filteredRestaurants?.length === 0 ? (
                    <div className="text-center py-5">
                        <FontAwesomeIcon icon={faUtensils} size="3x" className="mb-3 text-secondary" />
                        <p>No restaurants found matching your search.</p>
                    </div>
                ) : (
                    <Row xs={1} sm={2} lg={3} xxl={4} className="g-4">
                        {filteredRestaurants?.map((restaurant) => (
                            <Col key={restaurant.id}>
                                <RestaurantCard
                                    restaurant={restaurant}
                                />
                            </Col>
                        ))}
                    </Row>
                )
            }
        </ >
    );
};

export default Restaurants;