import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== 'admin') {
        // Enforce role-based strict routing if caught snooping
        if (user?.role === 'owner') {
            return <Navigate to="/dashboard/owner" replace />;
        }
        return <Navigate to="/dashboard/user" replace />;
    }

    return children;
};

export default AdminRoute;
