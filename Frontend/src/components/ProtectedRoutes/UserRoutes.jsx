import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const UserRoutes = () => {
    const user = useSelector((state) => state.auth.user);

    return user && user.role === "user"
        ? <Outlet />
        : <Navigate to="/admin" replace />;
};