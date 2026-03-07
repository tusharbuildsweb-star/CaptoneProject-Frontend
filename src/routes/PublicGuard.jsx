import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PublicGuard prevents 'owner' and 'admin' accounts from browsing the 
 * consumer-facing frontend pages (Home, Listings, etc.).
 * If they try to access these routes, they are forcibly redirected
 * to their respective dashboards.
 */
const PublicGuard = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isAuthenticated && user) {
        if (user.role === 'owner') {
            return <Navigate to="/dashboard/owner" replace state={{ from: location }} />;
        }
        if (user.role === 'admin') {
            return <Navigate to="/dashboard/admin" replace state={{ from: location }} />;
        }
    }

    // Standard 'user' role or unauthenticated guests can freely browse
    return <Outlet />;
};

export default PublicGuard;
