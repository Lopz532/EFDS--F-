import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function SubmissionList({ tareaId, onClose }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const fetch = async () => {
        setLoading(true);
        setErr(null);
        try {
            const r = await api.get(`/submissions/?tarea=${tareaId}`);
            setItems(r.data);
        } catch (e) {
            setErr(e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, [tareaId]);

    const toggleEntregado = async (s) => {
        try {
            await api.patch(`/submissions/${s.id}/`, { entregado: !s.entregado });
            fetch();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div>Cargando entregas...</div>;
    if (err) return <div style={{ color: "red" }}>{String(err)}</div>;

    return (
        <div style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Entregas</h3>
                <button onClick={onClose}>Cerrar</button>
            </div>
            {items.length === 0 && <p>No hay entregas aún.</p>}
            {items.map((s) => (
                <div key={s.id} style={{ border: "1px solid #ddd", padding: 8, marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>{s.alumno_name || s.alumno}</strong>
                        <span>{new Date(s.created_at).toLocaleString()}</span>
                    </div>
                    {s.comentario && <p>{s.comentario}</p>}
                    {s.archivo && (
                        <div>
                            <a href={s.archivo} target="_blank" rel="noreferrer">Descargar archivo</a>
                        </div>
                    )}
                    <div style={{ marginTop: 8 }}>
                        <span>Entregado: {s.entregado ? "Sí" : "No"}</span>
                        <button style={{ marginLeft: 8 }} onClick={() => toggleEntregado(s)}>
                            {s.entregado ? "Marcar no entregado" : "Marcar entregado"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
