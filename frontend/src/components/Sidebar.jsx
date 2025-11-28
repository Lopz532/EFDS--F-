import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const links = [
        { name: 'Dashboard', path: '/' },
        { name: 'Materias', path: '/materias' },
        { name: 'Tareas', path: '/tareas' },
        { name: 'Usuarios', path: '/usuarios' },
    ];

    return (
        <aside className="w-64 bg-white shadow flex flex-col p-4">
            {links.map(link => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                        `py-2 px-3 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-bold' : ''
                        }`
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </aside>
    );
};

export default Sidebar;
