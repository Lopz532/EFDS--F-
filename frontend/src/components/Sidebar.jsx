import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-60 bg-gray-900 text-white min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6">Menú</h2>

            <nav className="flex flex-col gap-3">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/materias">Materias</Link>
                <Link to="/tareas">Tareas</Link>
                <Link to="/alumnos">Alumnos</Link>
                <Link to="/logout">Cerrar sesión</Link>
            </nav>
        </aside>
    );
}
