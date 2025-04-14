import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../services/store";


import styles from "./home.module.css";
import SignupForm from "../components/SignupForm";

import homeBgImg from "../img/homeBgImg.jpg";
import { Root } from "react-dom/client";



const RestaurantHome = () => {

    const navigate = useNavigate();
    const restaurantAuthenticated = useSelector(
        (state: RootState) => state.auth.restaurantAuthenticated
    );

    useEffect(() => {
        if (restaurantAuthenticated) {
            navigate("/restaurant/dashboard");
        }
    }, [restaurantAuthenticated, navigate]);

    return (
        <>
            <div className={`container-fluid me-0 ${styles.restaurantHome}`}>
                <div className="row">
                    {/* Left Section: Signup Form */}
                    <div className={`col-md-6 d-flex flex-column justify-content-center ${styles.leftSection}`}>
                        <h1 className={`mb-4 ${styles.title}`}>
                            Sign up for DashDoor
                            <br />
                            and unlock sales
                        </h1>
                        <div className={styles.formContainer}>
                            <SignupForm />
                        </div>

                    </div>

                    {/* Right Section: Image */}
                    <div className={`col-md-6 me-0 p-0 ${styles.rightSection}`}>
                        <div className={styles.imageContainer}>
                            <img
                                src={homeBgImg}
                                alt="Restaurant showcasing food preparation"
                                className={styles.image}
                            />
                            <div className={styles.imageOverlay}>
                                <p className={styles.overlayText}>
                                    Drives higher margins with DoorDash
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RestaurantHome;