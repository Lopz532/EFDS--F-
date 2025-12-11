import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Materias() {
    const { user } = useContext(AuthContext);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const res = await axios.get("/materias/");
                setMaterias(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterias();
    }, []);

    if (loading) return <p className="text-center mt-4">Cargando materias...</p>;


    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materias.map((m) => (
                <Card key={m.id}>
                    <h2 className="text-lg font-bold">{m.nombre}</h2>
                    <p>{m.descripcion || "— sin descripción —"}</p>
                    <p className="text-sm text-gray-500">
                        Profesor: {m.profesor_nombre || "— no asignado —"}
                    </p>
                    <button
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => window.location.href = `/materias/${m.id}`}
                    >
                        Ver Materia
                    </button>
                </Card>
            ))}
        </div>
    );

    {
        user?.role === "teacher" && (
            <div style={{ marginBottom: 12 }}>
                <button
                    onClick={() => navigate("/materias/new")}
                    className="px-4 py-2 rounded bg-green-600 text-white"
                >
                    + Nueva Materia
                </button>
            </div>
        )
    }

}
