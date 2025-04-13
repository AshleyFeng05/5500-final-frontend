import { Routes, Route } from "react-router-dom";

import RestaurantNavbar from "./components/RestaurantNavbar"
import RestaurnatHome from "./pages/home";
import RestaurantProtectedRoutes from "./routes/RestaurantProtectedRoutes";
import Dashboard from "./pages/dashboard";


const Restaurant = () => {

    return (
        <>
            <RestaurantNavbar />

            <div style={{ marginTop: '56px' }}>
                <Routes>
                    <Route index element={<RestaurnatHome />} />

                    <Route element={<RestaurantProtectedRoutes />}>
                        <Route path="dashboard/*" element={<Dashboard />} />
                    </Route>
                </Routes>
            </div>
        </>
    )
};
export default Restaurant;