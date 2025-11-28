import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import Card from "../components/Card";

export default function Tareas() {
    const { materiaId } = useParams();
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const res = await axios.get(`/tareas/?materia=${materiaId}`);
                setTareas(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTareas();
    }, [materiaId]);

    if (loading) return <p>Cargando tareas...</p>;

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tareas.map((t) => (
                <Card key={t.id}>
                    <h2 className="text-lg font-bold">{t.titulo}</h2>
                    <p>{t.descripcion || "— sin descripción —"}</p>
                    <p className="text-sm text-gray-500">Profesor: {t.profesor_nombre}</p>
                    <p className="text-sm text-gray-500">Materia: {t.materia_nombre}</p>
                    <p className="text-sm text-gray-400">Entrega: {t.fecha_entrega}</p>
                    {t.archivo && (
                        <a href={t.archivo} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                            Descargar archivo
                        </a>
                    )}
                </Card>
            ))}
        </div>
    );
}