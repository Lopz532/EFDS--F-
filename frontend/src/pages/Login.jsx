import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e?.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(username, password); // usa AuthContext
      navigate("/dashboard");
    } catch (error) {
      console.error("login error:", error);
      setErr(error.response?.data?.detail || error.message || "Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", padding: 20 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <label>Usuario</label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario" />
        <label style={{ marginTop: 8 }}>Contraseña</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="contraseña" />
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        <Button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
