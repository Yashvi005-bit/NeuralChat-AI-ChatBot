import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkAuthStatus } from "../api/auth";
import api from "../api/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth]   = useState(false);
  const [user,   setUser]     = useState(null); // { name, email }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await checkAuthStatus(); // { name, email }
        setUser({ name: data.name, email: data.email });
        setIsAuth(true);
      } catch {
        setIsAuth(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.get("/user/logout");
    } catch {
      // ignore
    } finally {
      setIsAuth(false);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);