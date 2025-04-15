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
        <div className={`container py-4 ${styles.container}`}>
            <h2 className={`text-center ${styles.pageTitle}`}>Account Information</h2>

            <div className="card shadow-sm rounded-4 border-0 overflow-hidden">
                <div className="position-relative">
                    {localData.imageUrl && (
                        <img
                            src={localData.imageUrl}
                            alt="Restaurant"
                            className={`img-fluid w-100 ${styles.bannerImage}`}
                        />
                    )}

                    {localData.logoUrl && (
                        <img
                            src={localData.logoUrl}
                            alt="Restaurant Logo"
                            className={`position-absolute bg-white ${styles.logoImage}`}
                        />
                    )}
                </div>

                <div className="card-body pt-5 px-4 pb-4">
                    <h2 className={styles.restaurantName}>{localData.name}</h2>

                    <div className="mb-3 d-flex">
                        <div className={`text-secondary ${styles.infoLabel}`}>Email:</div>
                        <div>{localData.email}</div>
                    </div>
                    <div className="mb-3 d-flex">
                        <div className={`text-secondary ${styles.infoLabel}`}>Phone:</div>
                        <div>{localData.phone}</div>
                    </div>
                    <div className="mb-3 d-flex">
                        <div className={`text-secondary ${styles.infoLabel}`}>Address:</div>
                        <div>{localData.address}</div>
                    </div>

                    <div className="mt-4">
                        <button
                            className={`btn btn-danger rounded-pill me-2 ${styles.actionButton}`}
                            onClick={() => setShowModal(true)}
                        >
                            Edit Account
                        </button>
                        <button
                            className={`btn btn-outline-danger rounded-pill ${styles.actionButton}`}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
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