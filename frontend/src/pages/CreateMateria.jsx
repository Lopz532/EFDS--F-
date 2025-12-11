import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

export default function CreateMateria() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const res = await axios.post("/materias/", { nombre, descripcion });
            navigate(`/materias/${res.data.id}`); // ir al detalle
        } catch (error) {
            setErr(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 640, margin: "2rem auto", padding: 16 }}>
            <h2>Nueva Materia</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Nombre</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} required />
                </div>
                <div style={{ marginTop: 8 }}>
                    <label>Descripción</label>
                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                </div>
                {err && <div style={{ color: "red" }}>{JSON.stringify(err)}</div>}
                <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
                    {loading ? "Creando..." : "Crear Materia"}
                </button>
            </form>
        </div>
    );
}
