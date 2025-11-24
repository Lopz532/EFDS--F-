import React from "react";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.username}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
