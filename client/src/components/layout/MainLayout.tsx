import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#111618] dark:text-white">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col h-full overflow-y-auto relative scroll-smooth bg-background-light dark:bg-background-dark">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
