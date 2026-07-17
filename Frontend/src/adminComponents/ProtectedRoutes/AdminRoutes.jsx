import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

export const AdminRoutes = () => {
    const user = useSelector((state) => state.auth.user)
    return user && user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}