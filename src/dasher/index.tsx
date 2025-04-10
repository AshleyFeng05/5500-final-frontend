import { Routes, Route } from "react-router-dom";


import DasherHome from "./pages/home";
import DasherNavbar from "./components/DasherNavbar";


const Dasher = () => {

    return (
        <>
            <DasherNavbar />

            <div style={{ marginTop: '56px' }}>
                <Routes>
                    <Route index element={<DasherHome />} />
                </Routes>
            </div>


        </>
    )
};
export default Dasher;