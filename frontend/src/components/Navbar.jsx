import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">SmartCampus</h1>
            <div className="flex items-center gap-4">
                <span className="font-medium">{user?.username}</span>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                </button>
            </div>
        </nav>
    );
};

export default Navbar;