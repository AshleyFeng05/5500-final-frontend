import { useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { RestaurantType } from "../../services/restaurantApi";


const Account = () => {
    const restaurant = useSelector<RootState, RestaurantType | null>((state: RootState) => state.auth.restaurant);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "24px" }}>
            <h2>Account Information</h2>
            <div><strong>Name:</strong> {restaurant.name}</div>
            <div><strong>Email:</strong> {restaurant.email}</div>
            <div><strong>Phone:</strong> {restaurant.phone}</div>
            <div><strong>Address:</strong> {restaurant.address}</div>
            <div>
                <strong>Image:</strong><br />
                <img src={restaurant.imageUrl} alt="Restaurant" style={{ width: "200px", marginTop: "8px" }} />
            </div>
        </div>
    );
}
export default Account;