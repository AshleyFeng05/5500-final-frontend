import DashboardSidebar from "../components/DashboardSidebar";
import { Routes, Route } from "react-router-dom";
import Account from "../components/Account";
import AddDishPage from "../components/AddDishPage";
import RestaurantMenu from "../components/RestaurantMenu";

const Dashboard = () => {

    return (
        <>
            <DashboardSidebar />
            <div style={{ marginLeft: "220px", padding: "24px" }}>

                <Routes>

                    <Route index element={<div>Active Orders</div>} />

                    <Route path="menu" element={<RestaurantMenu />} />

                    <Route path="add-items" element={<AddDishPage />} />

                    <Route path="orders" element={<div>Orders</div>} />

                    <Route path="account" element={<Account />} />

                </Routes>
            </div>
        </>

    );
};
export default Dashboard;