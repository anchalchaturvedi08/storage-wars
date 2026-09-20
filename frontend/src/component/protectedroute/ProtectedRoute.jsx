import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        if (user.role === "seller") {
            return <Navigate to="/seller" replace />;
        }

        return <Navigate to="/buyer" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;