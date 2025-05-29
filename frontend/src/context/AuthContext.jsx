import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { login as loginAPI, register as registerAPI } from "../services/authService";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

    const fetchUser = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
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
      fetchUser(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginAPI(email, password);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
    router.push("/dashboard");
  };

  const register = async (email, password) => {
    const data = await registerAPI(email, password);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
