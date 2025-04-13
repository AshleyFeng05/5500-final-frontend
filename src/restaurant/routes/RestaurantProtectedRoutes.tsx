import { RootState } from "../../services/store"
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"

const RestaurantProtectedRoutes = () => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.restaurantAuthenticated
    );
    return isAuthenticated ? <Outlet /> : <Navigate to="/restaurant" replace />;
};
export default RestaurantProtectedRoutes;