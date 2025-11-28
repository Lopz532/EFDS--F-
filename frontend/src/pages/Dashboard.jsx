import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { LoadingSpinner } from "../components/Spinner";
import api from "../api/axiosConfig";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    materias: 0,
    tareas: 0,
    usuarios: 0,
  });
  const [recentMaterias, setRecentMaterias] = useState([]);
  const [recentTareas, setRecentTareas] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [materiasRes, tareasRes] = await Promise.all([
        api.get("materias/"),
        api.get("tareas/"),
      ]);

      setStats({
        materias: materiasRes.data.length,
        tareas: tareasRes.data.length,
        usuarios: 0, // Se puede agregar endpoint de usuarios
      });

      setRecentMaterias(materiasRes.data.slice(0, 5));
      setRecentTareas(tareasRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Cargando dashboard..." />
      </Layout>
    );
  }

  const isTeacher = user?.role === "teacher";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Bienvenido, {user?.first_name || user?.username}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Aquí está un resumen de tu plataforma educativa
            </p>
          </div>
          <Badge variant={isTeacher ? "teacher" : "student"} size="lg">
            {isTeacher ? "Profesor" : "Estudiante"}
          </Badge>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Materias</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.materias}</p>
                <p className="text-sm text-indigo-600 mt-1">Activas</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </Card>

          <Card hoverable className="border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tareas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tareas}</p>
                <p className="text-sm text-green-600 mt-1">Publicadas</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </Card>

          <Card hoverable className="border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Actividad</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">98%</p>
                <p className="text-sm text-amber-600 mt-1">Esta semana</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materias recientes */}
          <Card title="Materias Recientes" subtitle={`${stats.materias} total`}>
            {recentMaterias.length > 0 ? (
              <div className="space-y-3">
                {recentMaterias.map((materia) => (
                  <div
                    key={materia.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {materia.nombre[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{materia.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {materia.descripcion?.substring(0, 40)}
                          {materia.descripcion?.length > 40 ? "..." : ""}
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No hay materias disponibles</p>
            )}
          </Card>

          {/* Tareas recientes */}
          <Card title="Tareas Recientes" subtitle={`${stats.tareas} total`}>
            {recentTareas.length > 0 ? (
              <div className="space-y-3">
                {recentTareas.map((tarea) => (
                  <div
                    key={tarea.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tarea.titulo}</p>
                        <p className="text-sm text-gray-500">
                          {tarea.fecha_entrega
                            ? new Date(tarea.fecha_entrega).toLocaleDateString()
                            : "Sin fecha"}
                        </p>
                      </div>
                    </div>
                    {tarea.archivo && (
                      <Badge variant="info" size="sm">
                        📎 Archivo
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No hay tareas disponibles</p>
            )}
          </Card>
        </div>

        {/* Accesos rápidos */}
        <Card title="Accesos Rápidos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="gradient-primary p-3 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Nueva Materia</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Nueva Tarea</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Calendario</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Reportes</span>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
