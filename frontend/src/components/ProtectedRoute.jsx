import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();

  // espera a que AuthContext haya intentado cargar user
  if (!ready) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
