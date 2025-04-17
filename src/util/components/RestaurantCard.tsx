import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RestaurantType } from '../../services/restaurantApi';
import StarRating from './StarRating';
import styles from './RestaurantCard.module.css';

interface RestaurantCardProps {
    restaurant: Partial<RestaurantType>;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    const rating = restaurant.rating || 4.5;
    return (
        <Link
            to={`/dashboard/restaurant/${restaurant.id}`}
            className={styles.cardLink}
        >
            <div className={styles.restaurantContainer}>
                <div className={styles.imageWrapper}>
                    <img
                        src={restaurant.imageUrl}
                        className={styles.restaurantImage}
                        alt={restaurant.name || 'Restaurant'}
                    />
                </div>

                <div className={styles.contentContainer}>
                    <h5 className={styles.restaurantName}>{restaurant.name}</h5>

                    <div className={styles.ratingInfo}>
                        <StarRating
                            rating={rating}
                            numberOfRatings={restaurant.numberOfRatings}
                        />
                    </div>

                    <div className={styles.address}>{restaurant.address}</div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;