import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);

function App() {
  return <AppRouter />;
}

export default App;