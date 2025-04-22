import { Routes, Route } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

import ActiveOrder from "../components/ActiveOrder";
import ArchivedOrders from "../components/ArchivedOrders";
import DasherAccount from "../components/Account";
import AvailableOrders from "../components/AvailableOrders";
import { Navigate } from "react-router-dom";

const DasherDashboard = () => {

    return (
        <>
            <DashboardSidebar />
            <div style={{ marginLeft: "220px", padding: "24px" }}>
                <Routes>
                    <Route index element={<ActiveOrder />} />
                    <Route path="available-orders" element={<AvailableOrders />} />
                    <Route path="orders" element={<ArchivedOrders />} />
                    <Route path="account" element={<DasherAccount />} />
                    <Route path="*" element={<Navigate to="/dasher/dashboard" replace />} />
                </Routes>
            </div>
        </>
    )
}
export default DasherDashboard;