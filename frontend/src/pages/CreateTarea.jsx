// src/pages/CreateTarea.jsx
import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateTarea() {
    const { id: materiaId } = useParams(); // si la ruta lleva :id
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha_entrega, setFecha] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const data = new FormData();
            data.append("titulo", titulo);
            data.append("descripcion", descripcion);
            if (materiaId) data.append("materia", materiaId);
            if (fecha_entrega) data.append("fecha_entrega", fecha_entrega);
            if (archivo) data.append("archivo", archivo);

            // Importante: axiosConfig no debe forzar content-type para multipart (browser lo hace)
            await api.post("/tareas/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // al crear, redirige a la pagina de la materia o lista de tareas
            navigate(materiaId ? `/materias/${materiaId}` : "/tareas");
        } catch (error) {
            console.error(error);
            setErr(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: "2rem auto", padding: 16 }}>
            <h2>Crear tarea</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Título</label>
                    <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>
                <div>
                    <label>Descripción</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>
                <div>
                    <label>Fecha entrega</label>
                    <input type="datetime-local" value={fecha_entrega} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div>
                    <label>Archivo (opcional)</label>
                    <input type="file" onChange={(e) => setArchivo(e.target.files[0] || null)} />
                </div>
                {err && <div style={{ color: "red" }}>{JSON.stringify(err)}</div>}
                <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
            </form>
        </div>
    );
}
