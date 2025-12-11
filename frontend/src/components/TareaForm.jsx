import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export default function TareaForm({ materiaId, initialData = null, onSaved = () => { }, onCancel = () => { } }) {
    const [titulo, setTitulo] = useState(initialData?.titulo || "");
    const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
    const [fecha, setFecha] = useState(initialData?.fecha_entrega?.slice(0, 16) || "");
    const [archivo, setArchivo] = useState(null);
    const [loading, setLoading] = useState(false);
    const isEdit = Boolean(initialData?.id);

    useEffect(() => { if (initialData) { setTitulo(initialData.titulo || ""); setDescripcion(initialData.descripcion || ""); } }, [initialData]);

    const submit = async (e) => {
        e && e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("titulo", titulo);
            fd.append("descripcion", descripcion);
            fd.append("materia", materiaId);
            if (fecha) fd.append("fecha_entrega", new Date(fecha).toISOString());
            if (archivo) fd.append("archivo", archivo);

            if (isEdit) {
                await api.patch(`/tareas/${initialData.id}/`, fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await api.post("/tareas/", fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            onSaved();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Error al guardar");
        } finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
            <div>
                <label>Título</label>
                <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
            </div>
            <div>
                <label>Descripción</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
            <div>
                <label>Fecha entrega</label>
                <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
            <div>
                <label>Archivo (opcional)</label>
                <input type="file" onChange={e => setArchivo(e.target.files[0])} />
            </div>
            <div style={{ marginTop: 8 }}>
                <button type="submit" disabled={loading}>{loading ? "Guardando..." : (isEdit ? "Actualizar" : "Crear")}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</button>
            </div>
        </form>
    );
}
