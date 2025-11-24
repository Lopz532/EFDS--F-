import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosConfig";
import { setTokens, clearTokens, getAccessToken } from "../utils/tokenManager";

export const AuthContext = createContext({
  user: null,
  login: async () => { },
  logout: () => { },
  isAuthenticated: false,
  ready: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const loadMe = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }

    try {
      const { data } = await api.get("auth/me/");
      setUser(data);
    } catch (err) {
      // Si falla (p. ej. token expirado), interceptor intentará refresh
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (username, password) => {
    const resp = await api.post("auth/login/", { username, password });
    const { access, refresh } = resp.data;
    setTokens({ access, refresh });
    await loadMe();
    return resp.data;
  };

  const logout = async () => {
    // Si tienes endpoint /auth/logout/ puedes llamarlo antes de limpiar.
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      ready
    }}>
      {children}
    </AuthContext.Provider>
  );
};
