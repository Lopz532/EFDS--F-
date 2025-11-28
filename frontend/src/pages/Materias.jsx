import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { LoadingSpinner } from "../components/Spinner";
import api from "../api/axiosConfig";

export default function Materias() {
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMateria, setEditingMateria] = useState(null);
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadMaterias();
    }, []);

    const loadMaterias = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("materias/");
            setMaterias(data);
        } catch (error) {
            console.error("Error loading materias:", error);
            alert("Error al cargar materias");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingMateria) {
                await api.put(`materias/${editingMateria.id}/`, formData);
            } else {
                await api.post("materias/", formData);
            }
            setModalOpen(false);
            setFormData({ nombre: "", descripcion: "" });
            setEditingMateria(null);
            loadMaterias();
        } catch (error) {
            console.error("Error saving materia:", error);
            alert("Error al guardar materia");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (materia) => {
        setEditingMateria(materia);
        setFormData({ nombre: materia.nombre, descripcion: materia.descripcion });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta materia?")) return;

        try {
            await api.delete(`materias/${id}/`);
            loadMaterias();
        } catch (error) {
            console.error("Error deleting materia:", error);
            alert("Error al eliminar materia");
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingMateria(null);
        setFormData({ nombre: "", descripcion: "" });
    };

    const columns = [
        { header: "Nombre", accessor: "nombre" },
        {
            header: "Descripción",
            render: (row) => row.descripcion || "Sin descripción"
        },
        {
            header: "Fecha de creación",
            render: (row) => new Date(row.created_at).toLocaleDateString()
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
            )
        }
    ];

    if (loading) {
        return (
            <Layout>
                <LoadingSpinner message="Cargando materias..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Materias</h1>
                        <p className="text-gray-600 mt-1">Gestiona las materias del sistema</p>
                    </div>
                    <Button onClick={() => setModalOpen(true)}>
                        + Nueva Materia
                    </Button>
                </div>

                <Card>
                    <Table columns={columns} data={materias} />
                </Card>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={editingMateria ? "Editar Materia" : "Nueva Materia"}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal}>
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
                        label="Nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Matemáticas"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="4"
                            placeholder="Descripción de la materia"
                        />
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}
