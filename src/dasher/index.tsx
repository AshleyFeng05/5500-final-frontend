import { Routes, Route } from "react-router-dom";


import DasherHome from "./pages/home";
import DasherNavbar from "./components/DasherNavbar";
import DasherProtectedRoutes from "./routes/DasherProtectedRoutes";
import DasherDashboard from "./pages/dashboard";

const Dasher = () => {

    return (
        <>
            <DasherNavbar />

            <div style={{ marginTop: '56px' }}>
                <Routes>
                    <Route index element={<DasherHome />} />

                    <Route element={<DasherProtectedRoutes />}>
                        <Route path="dashboard/*" element={<DasherDashboard />} />
                    </Route>

                </Routes>
            </div >


        </>
    )
};
export default Dasher;