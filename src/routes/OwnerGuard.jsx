import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { Loader2 } from 'lucide-react';
import { loadUser } from '../app/features/authSlice';

const OwnerGuard = ({ children }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [status, setStatus] = useState('checking'); // 'checking', 'active', 'inactive'
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const checkSubscription = async () => {
            if (!isAuthenticated) {
                setStatus('inactive');
                return;
            }

            try {
                // If user role is NOT 'owner' yet, but they are trying to access this, 
                // it might be a stale session. We hit the owner status endpoint.
                // If the backend allows it (because of fresh role check in middleware), 
                // we sync the local user.
                const restRes = await api.get('restaurants/owner/me');

                if (restRes.data) {
                    const myRest = restRes.data;
                    setRestaurant(myRest);

                    // If backend returned a restaurant, it means the user IS an owner.
                    // If frontend thinks they are not, sync now!
                    if (user?.role !== 'owner') {
                        dispatch(loadUser());
                    }

                    if (myRest.subscriptionStatus === 'active') {
                        setStatus('active');
                    } else {
                        setStatus('inactive');
                    }
                } else {
                    setStatus('inactive');
                }
            } catch (error) {
                // If this fails with 403, they really aren't an owner.
                // If it fails with 401, they aren't logged in.
                // If it fails with 404, user exists but restaurant Application isn't approve yet?
                setStatus('inactive');
            }
        };

        checkSubscription();
    }, [isAuthenticated, user?.role, dispatch]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If the check is still happening, don't redirect to login yet even if role is 'user'
    // because the backend check might upgrade our role.
    if (status === 'checking') {
        return (
            <div className="w-full h-screen bg-zinc-950 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (status === 'inactive') {
        return <Navigate to="/activate-subscription" state={{ restaurantId: restaurant?._id }} replace />;
    }

    return children || <Outlet />;
};

export default OwnerGuard;
