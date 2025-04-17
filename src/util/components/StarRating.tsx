import React from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
    rating: number;
    numberOfRatings?: number;
    showCount?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    numberOfRatings = 100,
    showCount = true
}) => {

    const formatReviewCount = (count: number | undefined) => {
        if (count === undefined) return '0';

        if (count >= 1000) {
            const thousands = count / 1000;
            if (thousands >= 10) {
                return `${thousands}k+`;
            }
            return `${Math.floor(thousands * 10) / 10}k+`;
        }
        return `${Math.floor(count / 10) * 10}+`;
    }

    return (
        <div className={styles.ratingContainer}>
            <span className={styles.rating}>{rating.toFixed(1)}</span>
            <span className={styles.ratingIcon}>★</span>
            {showCount && (
                <span className={styles.reviews}>
                    ({formatReviewCount(numberOfRatings)})
                </span>
            )}
        </div>
    );
};

export default StarRating;