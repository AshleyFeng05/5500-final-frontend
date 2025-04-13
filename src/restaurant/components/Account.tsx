import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { RestaurantType } from "../../services/restaurantApi";
import styles from "./Account.module.css";
import EditAccountModal from "./EditAccountModal";
import { useState } from "react";
import { useUpdateRestaurantAccountMutation } from "../../services/restaurantApi";
import { setRestaurant } from "../../services/authSlice";

const Account = () => {
    const restaurant = useSelector<RootState, RestaurantType | null>(
        (state) => state.auth.restaurant
    );

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [localData, setLocalData] = useState<RestaurantType | null>(restaurant);
    const [updateRestaurantAccount] = useUpdateRestaurantAccountMutation();
    const handleSave = async (updated: Partial<RestaurantType>) => {
        if (!localData) return;
        const merged = { ...localData, ...updated };
        console.log(merged);
        try {
            const updatedRestaurant = await updateRestaurantAccount(merged).unwrap();
            setLocalData(merged);
            dispatch(setRestaurant(updatedRestaurant));
        } catch (error) {
            console.error("Failed to update restaurant account:", error);
        }
    };

    if (!localData) {
        return <div className="text-center py-4">No Account Info Available</div>;
    }

    return (
        <div className="container py-4">
            <h2>Account Information</h2>
            <div><strong>Name:</strong> {localData.name}</div>
            <div><strong>Email:</strong> {localData.email}</div>
            <div><strong>Phone:</strong> {localData.phone}</div>
            <div><strong>Address:</strong> {localData.address}</div>
            <div className="my-3">
                <strong>Image:</strong><br />
                <img src={localData.imageUrl} alt="Restaurant" style={{ width: "200px" }} className="rounded mt-2" />
            </div>

            <button className="btn btn-outline-primary mt-3" onClick={() => setShowModal(true)}>
                Edit Account
            </button>

            <EditAccountModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                restaurant={localData}
                onSave={handleSave}
            />
        </div>
    );
};

export default Account;
