// frontend/src/pages/AlumnoTareasDashboard.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Card from "../components/Card";

export default function AlumnoTareasDashboard() {
    const { materiaId } = useParams();
    const navigate = useNavigate();

    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);
    const [fileMap, setFileMap] = useState({});

    useEffect(() => {
        async function load() {
            if (!materiaId) {
                setTareas([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const resp = await api.get("/tareas/", { params: { materia: materiaId } });
                setTareas(Array.isArray(resp.data) ? resp.data : []);
            } catch (err) {
                console.error("fetchTareas err", err);
                setTareas([]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [materiaId]);

    const handleFileChange = (tareaId, file) => {
        setFileMap((prev) => ({ ...prev, [tareaId]: file }));
    };

    const handleUpload = async (tarea) => {
        if (!fileMap[tarea.id]) return alert("Selecciona un archivo primero.");
        setUploadingId(tarea.id);
        const formData = new FormData();
        formData.append("archivo", fileMap[tarea.id]);
        formData.append("entregado", true);
        try {
            const resp = await api.post("/submissions/", { tarea: tarea.id }, { headers: { "Content-Type": "multipart/form-data" } });
            const submissionId = resp.data.id;
            await api.patch(`/submissions/${submissionId}/`, formData);
            alert("Archivo subido correctamente!");
            setTareas((prev) =>
                prev.map((t) =>
                    t.id === tarea.id
                        ? { ...t, submission: { ...t.submission, entregado: true } }
                        : t
                )
            );
        } catch (err) {
            console.error("upload err", err);
            alert("Error al subir archivo.");
        } finally {
            setUploadingId(null);
        }
    };

    if (loading) return <p style={{ textAlign: "center", marginTop: 30 }}>Cargando tareas...</p>;

    const pendientes = tareas.filter((t) => !t.submission?.entregado);
    const entregadas = tareas.filter((t) => t.submission?.entregado);

    const renderTareaCard = (tarea) => (
        <Card
            key={tarea.id}
            style={{
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
                transition: "transform 0.2s",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <h3 style={{ marginBottom: 6 }}>{tarea.titulo}</h3>
            <p style={{ fontSize: 14, color: "#555" }}>
                Entrega: {tarea.fecha_entrega ? new Date(tarea.fecha_entrega).toLocaleString() : "Sin fecha"}
            </p>
            <p style={{ marginBottom: 12 }}>{tarea.descripcion || "Sin descripción"}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <input type="file" onChange={(e) => handleFileChange(tarea.id, e.target.files[0])} />
                <button
                    onClick={() => handleUpload(tarea)}
                    disabled={uploadingId === tarea.id}
                    style={{
                        backgroundColor: "#1976D2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    {uploadingId === tarea.id ? "Subiendo..." : "Subir archivo"}
                </button>
                {tarea.submission && (
                    <span
                        style={{
                            fontWeight: "bold",
                            color: tarea.submission.entregado ? "#4CAF50" : "#F44336",
                        }}
                    >
                        {tarea.submission.entregado ? "✅ Entregado" : "❌ Pendiente"}
                    </span>
                )}
            </div>
        </Card>
    );

    return (
        <div style={{ padding: 30 }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#1976D2",
                    color: "#fff",
                    cursor: "pointer",
                    marginBottom: 20,
                }}
            >
                ← Volver
            </button>
            <h1 style={{ textAlign: "center", marginBottom: 20 }}>Tablero de Tareas - Materia {materiaId}</h1>

            <div style={{ display: "flex", gap: 20, justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                    <h2 style={{ textAlign: "center", color: "#F44336" }}>Pendientes</h2>
                    {pendientes.length === 0 ? <p style={{ textAlign: "center", color: "#777" }}>No hay tareas pendientes</p> : pendientes.map(renderTareaCard)}
                </div>

                <div style={{ flex: 1, minWidth: 300 }}>
                    <h2 style={{ textAlign: "center", color: "#4CAF50" }}>Entregadas</h2>
                    {entregadas.length === 0 ? <p style={{ textAlign: "center", color: "#777" }}>No hay tareas entregadas</p> : entregadas.map(renderTareaCard)}
                </div>
            </div>
        </div>
    );
}