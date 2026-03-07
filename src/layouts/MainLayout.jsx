import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
