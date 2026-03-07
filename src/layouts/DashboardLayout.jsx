import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50">
            <Navbar />
            <main className="flex-grow pt-20 flex">
                <div className="flex-grow p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
