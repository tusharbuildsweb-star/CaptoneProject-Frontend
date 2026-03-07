import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="w-full h-screen bg-zinc-950 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        // Role mismatch: Redirect to appropriate dashboard
        if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
        if (user.role === 'owner') return <Navigate to="/dashboard/owner" replace />;
        return <Navigate to="/dashboard/user" replace />;
    }

    return children;
};

export default ProtectedRoute;
