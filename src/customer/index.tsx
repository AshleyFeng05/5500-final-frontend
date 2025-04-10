import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/home";
import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";


const Customer = () => {
    const [showUserAuthModal, setShowUserAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");

    const handleShowUserAuthModal = (mode: "signIn" | "signUp") => {
        setAuthMode(mode);
        setShowUserAuthModal(true);
    }
    const handleCloseUserAuthModal = () => setShowUserAuthModal(false);

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
                    <Route index element={
                        <Home handleShowUserAuthModal={handleShowUserAuthModal} />
                    } />
                </Routes>
            </div>
            <Footer />
        </>
    );
}
export default Customer;