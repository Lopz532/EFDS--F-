// frontend/src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Materias from "../pages/Materias";
import MateriaDetail from "../pages/MateriaDetail";
import Tareas from "../pages/Tareas";
import Usuarios from "../pages/Usuarios";
import CreateTarea from "../pages/CreateTarea";
import CreateMateria from "../pages/CreateMateria";
import TeacherSubmissions from "../pages/TeacherSubmissions";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Register from "../pages/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas con Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          {/* Materias */}
          <Route path="materias" element={<Materias />} />
          <Route path="materias/new" element={<CreateMateria />} />
          <Route path="materias/:id" element={<MateriaDetail />} />
          <Route path="materias/:id/tareas/new" element={<CreateTarea />} />

          {/* Tareas */}
          <Route path="tareas" element={<Tareas />} />
          <Route path="tareas/:tareaId/entregas" element={<TeacherSubmissions />} />

          {/* Usuarios */}
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

        {/* Rutas fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}