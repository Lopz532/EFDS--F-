import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.detail || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", padding: 20 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Usuario</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
