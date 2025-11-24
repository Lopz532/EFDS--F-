import axios from "axios";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

/*
 refreshAccessToken: hace POST a auth/refresh/ y retorna el nuevo access token.
 Usamos axios directo para evitar el interceptor circular.
*/
export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const resp = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", { refresh }, {
    headers: { "Content-Type": "application/json" },
  });

  const newAccess = resp.data.access;
  setTokens({ access: newAccess });
  return newAccess;
};
