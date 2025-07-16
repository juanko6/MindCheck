import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { login as loginAPI, register as registerAPI } from "../services/authService";
import { fetchUserData } from "../services/userService";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = async (jwt) => {
    try {
      const data = await fetchUserData(jwt);
      setUser(data);
    } catch (error) {
      console.error("Error cargando usuario:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    const data = await loginAPI(identifier, password);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await loadUser(data.access_token);
    router.push("/dashboard");
  };

  const register = async (userData) => {
    const data = await registerAPI(userData);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await loadUser(data.access_token);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
