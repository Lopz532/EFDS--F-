import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Badge from "../components/Badge";
import { LoadingSpinner } from "../components/Spinner";
import api from "../api/axiosConfig";

export default function Tareas() {
    const [tareas, setTareas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTarea, setEditingTarea] = useState(null);
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        materia: "",
        fecha_entrega: "",
        archivo: null,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tareasRes, materiasRes] = await Promise.all([
                api.get("tareas/"),
                api.get("materias/"),
            ]);
            setTareas(tareasRes.data);
            setMaterias(materiasRes.data);
        } catch (error) {
            console.error("Error loading data:", error);
            alert("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formDataToSend = new FormData();
            formDataToSend.append("titulo", formData.titulo);
            formDataToSend.append("descripcion", formData.descripcion);
            formDataToSend.append("materia", formData.materia);
            if (formData.fecha_entrega) {
                formDataToSend.append("fecha_entrega", formData.fecha_entrega);
            }
            if (formData.archivo) {
                formDataToSend.append("archivo", formData.archivo);
            }

            if (editingTarea) {
                await api.put(`tareas/${editingTarea.id}/`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post("tareas/", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setModalOpen(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error("Error saving tarea:", error);
            alert("Error al guardar tarea");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (tarea) => {
        setEditingTarea(tarea);
        setFormData({
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            materia: tarea.materia,
            fecha_entrega: tarea.fecha_entrega ? tarea.fecha_entrega.split("T")[0] : "",
            archivo: null,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;

        try {
            await api.delete(`tareas/${id}/`);
            loadData();
        } catch (error) {
            console.error("Error deleting tarea:", error);
            alert("Error al eliminar tarea");
        }
    };

    const resetForm = () => {
        setEditingTarea(null);
        setFormData({
            titulo: "",
            descripcion: "",
            materia: "",
            fecha_entrega: "",
            archivo: null,
        });
    };

    const getMateriaName = (materiaId) => {
        const materia = materias.find((m) => m.id === materiaId);
        return materia?.nombre || "Desconocida";
    };

    const columns = [
        { header: "Título", accessor: "titulo" },
        {
            header: "Materia",
            render: (row) => (
                <Badge variant="primary" size="sm">
                    {getMateriaName(row.materia)}
                </Badge>
            ),
        },
        {
            header: "Fecha de Entrega",
            render: (row) =>
                row.fecha_entrega
                    ? new Date(row.fecha_entrega).toLocaleDateString()
                    : "Sin fecha",
        },
        {
            header: "Archivo",
            render: (row) =>
                row.archivo ? (
                    <Badge variant="info" size="sm">
                        📎 Adjunto
                    </Badge>
                ) : (
                    <span className="text-gray-400 text-sm">Sin archivo</span>
                ),
        },
        {
            header: "Acciones",
            render: (row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
                        Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <Layout>
                <LoadingSpinner message="Cargando tareas..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
                        <p className="text-gray-600 mt-1">Gestiona las tareas y asignaciones</p>
                    </div>
                    <Button onClick={() => setModalOpen(true)}>+ Nueva Tarea</Button>
                </div>

                <Card>
                    <Table columns={columns} data={tareas} />
                </Card>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    resetForm();
                }}
                title={editingTarea ? "Editar Tarea" : "Nueva Tarea"}
                size="lg"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setModalOpen(false);
                                resetForm();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Guardando..." : "Guardar"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Título"
                        required
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Ej: Tarea de Álgebra"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) =>
                                setFormData({ ...formData, descripcion: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="4"
                            placeholder="Descripción de la tarea"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Materia <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.materia}
                            onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Selecciona una materia</option>
                            {materias.map((materia) => (
                                <option key={materia.id} value={materia.id}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Fecha de Entrega"
                        type="date"
                        value={formData.fecha_entrega}
                        onChange={(e) =>
                            setFormData({ ...formData, fecha_entrega: e.target.value })
                        }
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Archivo Adjunto
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setFormData({ ...formData, archivo: e.target.files[0] })
                            }
                            className="w-full px-4 py-2 border border-gray-300 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-500"
                        />
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}
