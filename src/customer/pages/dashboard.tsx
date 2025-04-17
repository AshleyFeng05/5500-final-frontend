import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Restaurants from "../components/Restaurants";
import AccountPage from "../components/AccountPage";
import { Navigate } from "react-router-dom";

const Dashboard = () => {

    return (
        <div>
            <Sidebar />

            <div style={{ marginLeft: "60px" }}>
                <Container className="py-4">
                    <Routes>
                        <Route index element={<Restaurants />} />
                        <Route path="orders" element={<div>Orders</div>} />
                        <Route path="account" element={<AccountPage />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Container>
            </div>
        </div >
    );
};
export default Dashboard;