import React, { useState } from "react";
import api from "../api/axiosConfig";

export default function SubmissionForm({ tareaId, onSaved }) {
    const [file, setFile] = useState(null);
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        if (!file && comentario.trim() === "") {
            setErr("Adjunta un archivo o escribe un comentario.");
            return;
        }
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("tarea", tareaId);
            if (file) fd.append("archivo", file);
            fd.append("comentario", comentario);

            await api.post("/submissions/", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFile(null);
            setComentario("");
            if (onSaved) onSaved();
        } catch (e) {
            setErr(e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
            <div>
                <label>Archivo</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div style={{ marginTop: 8 }}>
                <label>Comentario</label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} />
            </div>
            {err && <div style={{ color: "red", marginTop: 8 }}>{String(err)}</div>}
            <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "Enviando..." : "Enviar entrega"}
            </button>
        </form>
    );
}
