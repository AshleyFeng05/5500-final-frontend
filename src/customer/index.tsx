import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/home";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard";

import { RootState } from "../services/store";
import { useSelector } from "react-redux";


const Customer = () => {
    const [showUserAuthModal, setShowUserAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");

    const handleShowUserAuthModal = (mode: "signIn" | "signUp") => {
        setAuthMode(mode);
        setShowUserAuthModal(true);
    }
    const handleCloseUserAuthModal = () => setShowUserAuthModal(false);

    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.customerAuthenticated
    );
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated])

    return (
        <>
            <AppNavbar
                showAuthModal={showUserAuthModal}
                onOpenAuthModal={handleShowUserAuthModal}
                onHideAuthModal={handleCloseUserAuthModal}
                authMode={authMode}
            />
            <div style={{ marginTop: '56px' }}>
                <Routes>
                    {/* Home page route */}
                    <Route index element={
                        <Home handleShowUserAuthModal={handleShowUserAuthModal} />
                    } />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard/*" element={<Dashboard />} />
                        <Route path="orders" element={<div>Orders</div>} />
                    </Route>

                </Routes>
            </div>
        </>
    );
}
export default Customer;