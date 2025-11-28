import React from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Badge from "./Badge";

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo y menú móvil */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="gradient-primary text-white p-2 rounded-lg">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                                SmartCampus
                            </span>
                        </Link>
                    </div>

                    {/* Usuario y acciones */}
                    <div className="flex items-center gap-4">
                        {/* Notificaciones */}
                        <button className="relative text-gray-600 hover:text-gray-900 focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* Info de usuario */}
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.first_name || user?.username}
                                </p>
                                <Badge variant={user?.role === "teacher" ? "teacher" : "student"} size="sm">
                                    {user?.role === "teacher" ? "Profesor" : "Estudiante"}
                                </Badge>
                            </div>
                            <div className="relative group">
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                        {(user?.first_name?.[0] || user?.username?.[0] || "U").toUpperCase()}
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <Link
                                        to="/perfil"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                                    >
                                        Mi Perfil
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
