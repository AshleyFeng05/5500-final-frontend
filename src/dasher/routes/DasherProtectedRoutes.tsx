import { RootState } from "../../services/store";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const DasherProtectedRoutes = () => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.dasherAuthenticated
    );
    return isAuthenticated ? <Outlet /> : <Navigate to="/dasher" replace />;
};
export default DasherProtectedRoutes;