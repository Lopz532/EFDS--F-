import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
