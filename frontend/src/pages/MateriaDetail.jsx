import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Card from "../components/Card";
import TareaForm from "../components/TareaForm";
import useAuth from "../hooks/useAuth";
import SubmissionList from "../components/SubmissionList";
import SubmissionForm from "../components/SubmissionForm";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function MateriaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [materia, setMateria] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    // controla qué tarea está abierta para ver entregas (id) o null
    const [openSubFor, setOpenSubFor] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const r = await api.get(`/materias/${id}/`);
            setMateria(r.data);
            const rt = await api.get(`/tareas/?materia=${id}`);
            setTareas(rt.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (!materia) return <p>Materia no encontrada.</p>;

    const buildFileUrl = (archivo) => {
        if (!archivo) return null;
        if (archivo.startsWith("http://") || archivo.startsWith("https://")) return archivo;
        return `${API_BASE}${archivo.startsWith("/") ? "" : "/"}${archivo}`;
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ margin: 0 }}>{materia.nombre}</h1>
                    <p style={{ margin: 0 }}>{materia.descripcion || "— sin descripción —"}</p>
                    <small>Profesor: {materia.profesor_name || materia.creado_por}</small>
                </div>
                <div>
                    <button onClick={() => navigate("/materias")} style={{ marginRight: 8 }}>
                        ← Volver
                    </button>
                    {user?.role === "teacher" && (
                        <button
                            onClick={() => {
                                setEditing(null);
                                setShowForm(true);
                            }}
                        >
                            + Nueva tarea
                        </button>
                    )}
                </div>
            </div>

            {/* Formulario inline para crear/editar tarea (teacher) */}
            {showForm && (
                <div style={{ marginTop: 12 }}>
                    <TareaForm
                        materiaId={id}
                        initialData={editing}
                        onCancel={() => setShowForm(false)}
                        onSaved={() => {
                            setShowForm(false);
                            fetchAll();
                        }}
                    />
                </div>
            )}

            <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
                {tareas.length === 0 ? (
                    <p>No hay tareas.</p>
                ) : (
                    tareas.map((t) => {
                        const fileUrl = buildFileUrl(t.archivo || t.file || "");
                        const isCreator = t.creado_por === user?.id || t.creado_por === user?.username;
                        return (
                            <Card key={t.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0 }}>{t.titulo}</h3>
                                        <p style={{ marginTop: 6 }}>{t.descripcion}</p>
                                        <small>Entrega: {t.fecha_entrega || "—"}</small>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {user?.role === "teacher" && isCreator && (
                                            <button
                                                onClick={() => {
                                                    setEditing(t);
                                                    setShowForm(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                        )}

                                        <button onClick={() => setOpenSubFor(t.id)}>Ver entregas</button>

                                        {fileUrl && (
                                            <a href={fileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                                                <button>Ver archivo</button>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Sección expandible: entregas + form de entrega */}
                                {openSubFor === t.id && (
                                    <div style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <strong>Entregas de: {t.titulo}</strong>
                                            <button onClick={() => setOpenSubFor(null)}>Cerrar</button>
                                        </div>

                                        <div style={{ marginTop: 8 }}>
                                            <SubmissionList tareaId={t.id} />
                                        </div>

                                        {/* Si el usuario no es teacher, mostrar formulario para subir entrega */}
                                        {user?.role !== "teacher" && (
                                            <div style={{ marginTop: 12 }}>
                                                <h4>Enviar entrega</h4>
                                                <SubmissionForm
                                                    tareaId={t.id}
                                                    onSaved={() => {
                                                        // refrescar la lista de tareas para actualizar contadores si quieres
                                                        fetchAll();
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
