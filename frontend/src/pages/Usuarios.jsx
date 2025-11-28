import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import { LoadingSpinner } from "../components/Spinner";
import api from "../api/axiosConfig";
import useAuth from "../hooks/useAuth";

export default function Usuarios() {
    const { user: currentUser } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            // Nota: Necesitarías un endpoint GET /api/users/ en el backend
            // Por ahora usamos un placeholder
            const { data } = await api.get("users/");
            setUsuarios(data);
        } catch (error) {
            console.error("Error loading usuarios:", error);
            // Si no existe el endpoint, mostramos datos de ejemplo
            setUsuarios([
                {
                    id: 1,
                    username: "admin",
                    email: "admin@smartcampus.com",
                    first_name: "Admin",
                    last_name: "User",
                    role: "teacher",
                    is_active: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("¿Estás seguro de desactivar este usuario?")) return;

        try {
            await api.delete(`users/${userId}/`, {
                data: { reason: "Desactivado desde panel de administración" },
            });
            loadUsuarios();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error al desactivar usuario");
        }
    };

    const handleRestore = async (userId) => {
        try {
            await api.post(`users/${userId}/restore/`);
            loadUsuarios();
        } catch (error) {
            console.error("Error restoring user:", error);
            alert("Error al restaurar usuario");
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setDetailModalOpen(true);
    };

    const columns = [
        {
            header: "Usuario",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {(row.first_name?.[0] || row.username[0]).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {row.first_name} {row.last_name}
                        </p>
                        <p className="text-sm text-gray-500">@{row.username}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Rol",
            render: (row) => (
                <Badge variant={row.role === "teacher" ? "teacher" : "student"}>
                    {row.role === "teacher" ? "Profesor" : "Estudiante"}
                </Badge>
            ),
        },
        {
            header: "Estado",
            render: (row) => (
                <Badge variant={row.is_active ? "success" : "danger"}>
                    {row.is_active ? "Activo" : "Inactivo"}
                </Badge>
            ),
        },
        {
            header: "Acciones",
            render: (row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleViewDetails(row)}>
                        Ver
                    </Button>
                    {row.is_active ? (
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(row.id)}
                            disabled={row.id === currentUser?.id}
                        >
                            Desactivar
                        </Button>
                    ) : (
                        <Button size="sm" variant="success" onClick={() => handleRestore(row.id)}>
                            Restaurar
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <Layout>
                <LoadingSpinner message="Cargando usuarios..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona los usuarios del sistema
                        </p>
                    </div>
                    <Button onClick={() => alert("Función de agregar usuario próximamente")}>
                        + Nuevo Usuario
                    </Button>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Usuarios</p>
                                <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
                            </div>
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Profesores</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {usuarios.filter((u) => u.role === "teacher").length}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Estudiantes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {usuarios.filter((u) => u.role === "student").length}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <Table columns={columns} data={usuarios} />
                </Card>
            </div>

            {/* Modal de detalles */}
            <Modal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title="Detalles del Usuario"
                footer={
                    <Button onClick={() => setDetailModalOpen(false)}>Cerrar</Button>
                }
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                                {(selectedUser.first_name?.[0] || selectedUser.username[0]).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {selectedUser.first_name} {selectedUser.last_name}
                                </h3>
                                <p className="text-gray-600">@{selectedUser.username}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Rol</p>
                                <Badge variant={selectedUser.role === "teacher" ? "teacher" : "student"}>
                                    {selectedUser.role === "teacher" ? "Profesor" : "Estudiante"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Estado</p>
                                <Badge variant={selectedUser.is_active ? "success" : "danger"}>
                                    {selectedUser.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">ID</p>
                                <p className="font-medium">#{selectedUser.id}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
}
