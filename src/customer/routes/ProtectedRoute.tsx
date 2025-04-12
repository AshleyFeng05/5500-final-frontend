import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../services/store";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.customerAuthenticated
    );

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;