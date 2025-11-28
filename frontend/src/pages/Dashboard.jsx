import React, { useState, useContext, useEffect } from "react";
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

      {/* Selección de salón */}
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

      {/* Selección de materia */}
      {salonSeleccionado && !materiaSeleccionada && (
        <Materias
          onSelectMateria={(m) => setMateriaSeleccionada(m)}
          salon={salonSeleccionado}
        />
      )}

      {/* Tareas de la materia */}
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

export default Dashboard;
