import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) return null;

    if (!isAuthenticated || (!allowedRoles.includes(user?.role) && user?.role !== 'admin')) {
        // Redirect to appropriate dashboard or home depending on role
        if (!isAuthenticated) return <Navigate to="/login" replace />;
        if (user.role === 'owner') return <Navigate to="/dashboard/owner" replace />;
        if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
        return <Navigate to="/dashboard/user" replace />;
    }

    return children;
};

export default RoleRoute;
