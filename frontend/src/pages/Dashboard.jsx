/*import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Materias from "./Materias";
import Tareas from "./Tareas";
import Card from "../components/Card";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [salonSeleccionado, setSalonSeleccionado] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

  // Lista de salones para el usuario
  const [salones, setSalones] = useState([]);
  const [loadingSalones, setLoadingSalones] = useState(true);

  useEffect(() => {
    const fetchSalones = async () => {
      try {
        // Por simplicidad, suponemos que user.salones es un array de salones
        if (user.role === "student") {
          setSalones([user.salon || user.classroom]);
        } else if (user.role === "teacher") {
          // Para profesores, traer todos los salones donde imparte clases
          setSalones(user.salones || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSalones(false);
      }
    };
    fetchSalones();
  }, [user]);

  if (loadingSalones) return <Spinner />;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Bienvenido, {user.username}</h1>

      {/* Selección de salón 
      {!salonSeleccionado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salones.map((s) => (
            <Card key={s} title={`Salón: ${s}`}>
              <button
                className="btn-primary mt-2"
                onClick={() => setSalonSeleccionado(s)}
              >
                Entrar
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Selección de materia 
      {salonSeleccionado && !materiaSeleccionada && (
        <Materias
          onSelectMateria={(m) => setMateriaSeleccionada(m)}
          salon={salonSeleccionado}
        />
      )}

      {/* Tareas de la materia *
      {materiaSeleccionada && (
        <div>
          <button
            className="btn-secondary mb-4"
            onClick={() => setMateriaSeleccionada(null)}
          >
            Volver a materias
          </button>
          <Tareas materiaId={materiaSeleccionada.id} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;*/

import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/materias/");
        if (mounted) setMaterias(res.data);
      } catch (err) {
        console.error("Error cargando materias:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>SmartCampus</h1>
        <div>
          <span>{user?.username}</span>
          <button onClick={logout} style={{ marginLeft: 12 }}>Cerrar sesión</button>
        </div>
      </header>

      <h2 style={{ marginTop: 20 }}>Bienvenido, {user?.username}</h2>

      {loading ? <p>Cargando materias...</p> : (
        materias.length === 0
          ? <p>No hay materias visibles para este usuario.</p>
          : <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginTop: 12 }}>
            {materias.map(m => (
              <div key={m.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <h3>{m.nombre}</h3>
                <p>{m.descripcion || "— sin descripción —"}</p>
                <p style={{ fontSize: 12, color: "#666" }}>Profesor: {m.profesor_name || m.creado_por}</p>
                <button onClick={() => window.location.href = `/materias/${m.id}`} style={{ marginTop: 8 }}>Ver materia</button>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
