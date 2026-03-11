import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "./authAPI";
import api from "../../services/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // token exists - attempt to load user
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const data = await getCurrentUser();
        setUser(data.user);
        // dev: log loaded user for debugging redirects
        // eslint-disable-next-line no-console
        console.debug("Auth: loaded user from /auth/me:", data.user);
      } catch (err) {
        setUser(null);
        // eslint-disable-next-line no-console
        console.debug("Auth: failed to load /auth/me", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    // ensure axios sends Authorization for subsequent requests
    api.defaults.headers.common = api.defaults.headers.common || {};
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(userData);
    // dev: log when login sets user
    // eslint-disable-next-line no-console
    console.debug("Auth: login set user:", userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    try{
      if(api?.defaults?.headers?.common){
        delete api.defaults.headers.common.Authorization;
      }
    }catch(e){}
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    // dev: log user updates
    // eslint-disable-next-line no-console
    console.debug("Auth: updateUser:", userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};