import { Routes, Route } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

import ActiveOrder from "../components/ActiveOrder";

const DasherDashboard = () => {
    return (
        <>
            <DashboardSidebar />
            <div style={{ marginLeft: "220px", padding: "24px" }}>
                <Routes>
                    <Route index element={<ActiveOrder />} />
                    <Route path="orders" element={<div>Orders</div>} />
                    <Route path="account" element={<div>Account</div>} />
                </Routes>
            </div>
        </>
    )
}
export default DasherDashboard;