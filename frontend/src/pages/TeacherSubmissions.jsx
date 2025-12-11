import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Card from "../components/Card";

export default function TeacherSubmissions() {
    const { tareaId } = useParams();
    const navigate = useNavigate();

    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        async function loadSubs() {
            if (!tareaId) {
                setSubs([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const resp = await api.get("/submissions/", { params: { tarea: tareaId } });
                setSubs(Array.isArray(resp.data) ? resp.data : []);
            } catch (err) {
                console.error("Error al cargar entregas:", err);
                setSubs([]);
            } finally {
                setLoading(false);
            }
        }

        loadSubs();
    }, [tareaId]);

    const toggleEntregado = async (submission) => {
        setSavingId(submission.id);
        try {
            const resp = await api.patch(`/submissions/${submission.id}/`, {
                entregado: !submission.entregado,
            });
            setSubs((prev) =>
                prev.map((s) => (s.id === resp.data.id ? resp.data : s))
            );
        } catch (err) {
            console.error("Error al actualizar entrega:", err);
            alert("No se pudo actualizar el estado.");
        } finally {
            setSavingId(null);
        }
    };

    const openFile = (url) => {
        if (!url) return alert("No hay archivo disponible.");
        window.open(url, "_blank", "noopener");
    };

    if (loading) return <p>Cargando entregas...</p>;

    return (
        <div style={{ padding: 20 }}>
            <button onClick={() => navigate(-1)}>← Volver</button>
            <h2>Entregas de la tarea {tareaId}</h2>

            {subs.length === 0 ? (
                <p>No hay entregas todavía.</p>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {subs.map((s) => (
                        <Card key={s.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <div>
                                    <strong>{s.alumno_name || `#${s.alumno}`}</strong>
                                    <div style={{ fontSize: 13, color: "#555" }}>
                                        {s.created_at ? new Date(s.created_at).toLocaleString() : ""}
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        {s.comentario ? <p>{s.comentario}</p> : <small>Sin comentario</small>}
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                                    <button onClick={() => openFile(s.archivo)}>Ver archivo</button>
                                    <button
                                        onClick={() => toggleEntregado(s)}
                                        disabled={savingId === s.id}
                                    >
                                        {s.entregado ? "Marcado como entregado" : "No entregado"}
                                    </button>
                                    <div style={{ fontSize: 13 }}>
                                        Estado: {s.entregado ? "✅ Entregado" : "❌ Pendiente"}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
