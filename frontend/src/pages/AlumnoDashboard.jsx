// frontend/src/pages/AlumnoTareas.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Card from "../components/Card";

export default function AlumnoTareas() {
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

    if (loading) return <p style={{ textAlign: "center", marginTop: 20 }}>Cargando tareas...</p>;

    return (
        <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
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
            <h1 style={{ textAlign: "center", marginBottom: 20 }}>Tareas de la materia {materiaId}</h1>

            {tareas.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777" }}>No hay tareas disponibles.</p>
            ) : (
                <div style={{ display: "grid", gap: 20 }}>
                    {tareas.map((tarea) => (
                        <Card key={tarea.id} style={{ padding: 20, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                            <h2 style={{ marginBottom: 6 }}>{tarea.titulo}</h2>
                            <p style={{ color: "#555", marginBottom: 12 }}>
                                Entrega: {tarea.fecha_entrega ? new Date(tarea.fecha_entrega).toLocaleString() : "Sin fecha"}
                            </p>
                            <p style={{ marginBottom: 12 }}>{tarea.descripcion || "Sin descripción"}</p>

                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(tarea.id, e.target.files[0])}
                                    style={{ cursor: "pointer" }}
                                />
                                <button
                                    onClick={() => handleUpload(tarea)}
                                    disabled={uploadingId === tarea.id}
                                    style={{
                                        backgroundColor: tarea.submission?.entregado ? "#4CAF50" : "#1976D2",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {uploadingId === tarea.id
                                        ? "Subiendo..."
                                        : tarea.submission?.entregado
                                            ? "Archivo subido"
                                            : "Subir archivo"}
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
                    ))}
                </div>
            )}
        </div>
    );
}