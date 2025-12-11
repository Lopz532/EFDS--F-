// frontend/src/components/Layout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí podrías limpiar el token o sesión
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Menú lateral */}
            <nav
                style={{
                    width: 200,
                    background: "#2C3E50",
                    color: "#fff",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <h2>Sistema Escolar</h2>
                <Link to="/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                <Link to="/materias" style={{ color: "#fff" }}>Materias</Link>
                <Link to="/tareas" style={{ color: "#fff" }}>Tareas</Link>
                <Link to="/usuarios" style={{ color: "#fff" }}>Alumnos</Link>
                <button onClick={handleLogout} style={{ marginTop: "auto" }}>Cerrar sesión</button>
            </nav>

            {/* Contenido principal */}
            <main style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </main>
        </div>
    );
}