import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../services/store";
import { RestaurantType, useUpdateRestaurantAccountMutation } from "../../services/restaurantApi";
import { restaurantLogout, setRestaurant } from "../../services/authSlice";
import EditAccountModal from "./EditAccountModal";
import styles from "./Account.module.css";

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
        try {
            const updatedRestaurant = await updateRestaurantAccount(merged).unwrap();
            setLocalData(merged);
            dispatch(setRestaurant(updatedRestaurant));
        } catch (error) {
            console.error("Failed to update restaurant account:", error);
        }
    };
    const handleLogout = () => {
        dispatch(restaurantLogout())
    }

    if (!localData) {
        return <div className="text-center py-4">No Account Info Available</div>;
    }

    return (
        <div className="container w-50">
            <h2 className="text-center mb-4">Account Information</h2>

            <div className={`card shadow-sm ${styles.accountCard}`}>
                <div className={styles.bannerWrapper}>
                    <img
                        src={localData.imageUrl}
                        alt="Restaurant"
                        className={`img-fluid rounded-top ${styles.bannerImage}`}
                    />
                    {localData.logoUrl && (
                        <img
                            src={localData.logoUrl}
                            alt="Restaurant Logo"
                            className={styles.logoImage}
                        />
                    )}
                </div>

                <div className={`card-body ${styles.cardBody} mt-4`}>
                    <h2 className="card-title mb-4 fw-bold">{localData.name}</h2>

                    <div className="mb-3 d-flex">
                        <div className="fw-bold me-2" style={{ minWidth: "80px" }}>Email:</div>
                        <div>{localData.email}</div>
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="fw-bold me-2" style={{ minWidth: "80px" }}>Phone:</div>
                        <div>{localData.phone}</div>
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="fw-bold me-2" style={{ minWidth: "80px" }}>Address:</div>
                        <div>{localData.address}</div>
                    </div>


                    <button
                        className="btn btn-outline-danger mt-3 rounded-pill"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Account
                    </button>
                    <button
                        className="btn btn-outline-secondary mt-3 rounded-pill ms-2"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

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
