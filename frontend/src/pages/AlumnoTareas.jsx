// frontend/src/pages/AlumnoDashboard.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function AlumnoDashboard() {
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMaterias() {
            setLoading(true);
            try {
                const resp = await api.get("/materias/"); // ajusta endpoint si es distinto
                setMaterias(Array.isArray(resp.data) ? resp.data : []);
            } catch (err) {
                console.error("fetchMaterias err", err);
                setMaterias([]);
            } finally {
                setLoading(false);
            }
        }
        fetchMaterias();
    }, []);

    function formatDate(dateStr) {
        return dateStr ? new Date(dateStr).toLocaleString() : "Sin fecha";
    }

    function goToTareas(materiaId) {
        navigate(`/alumno/materias/${materiaId}`);
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando materias...</p>;

    return (
        <div style={{ padding: 20 }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1>Bienvenido, Alumno</h1>
                <button onClick={() => navigate("/logout")} style={{ padding: "6px 12px", cursor: "pointer" }}>Cerrar sesión</button>
            </header>

            {materias.length === 0 ? (
                <p>No tienes materias asignadas.</p>
            ) : (
                <div style={{ display: "grid", gap: 16 }}>
                    {materias.map((m) => (
                        <Card key={m.id} style={{ borderLeft: "5px solid #4CAF50", padding: 16 }}>
                            <h2 style={{ marginBottom: 8 }}>{m.nombre}</h2>
                            <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>{m.descripcion || "Sin descripción"}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 13, color: "#888" }}>Profesor: {m.profesor_name}</span>
                                <button
                                    onClick={() => goToTareas(m.id)}
                                    style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: 4 }}
                                >
                                    Ver tareas
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}