import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-black/40 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none"></div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
