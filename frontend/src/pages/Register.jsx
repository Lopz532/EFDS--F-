import React, { useState } from "react";
import api from "../api/axiosConfig"; // tu axios ya configurado
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        role: "student",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/register/", form);
            alert("Usuario creado con éxito");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("Error al crear usuario");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h2>Crear cuenta</h2>
            <form onSubmit={handleSubmit}>
                <input name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} required />
                <input name="last_name" placeholder="Apellido" value={form.last_name} onChange={handleChange} required />
                <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
                <select name="role" value={form.role} onChange={handleChange} required>
                    <option value="student">Alumno</option>
                    <option value="teacher">Profesor</option>
                </select>
                <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
                <br />
                <button type="submit">Crear cuenta</button>
                <br />
                <Link to="/login">¿Ya tienes cuenta?</Link>
            </form>
        </div>
    );
}
