// context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import {
  login as loginAPI,
  register as registerAPI,
  verifyEmail as verifyEmailAPI,
  resendCode as resendCodeAPI
} from "../services/authService";
import { fetchUserData } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null);
  const router = useRouter();

  const handleInvalidToken = () => {
  localStorage.removeItem("token");
  setToken(null);
  setUser(null);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  Toast.fire({
    icon: 'warning',
    title: 'Sesión expirada'
  }).then(() => {
    router.push("/login");
  });
};

  const loadUser = async (jwt) => {
    try {
      const data = await fetchUserData(jwt);
      setUser(data);
      return data;
    } catch (error) {
      console.error("Error cargando usuario:", error);

      // ✅ Token inválido o expirado: cerrar sesión automáticamente
      if (error.message.includes("No se pudo cargar el usuario") ||
        error.message.includes("401") ||
        error.message.includes("403")) {
        handleInvalidToken();
      }

      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
        // ✅ Verificar que estamos en el cliente
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const storedToken = localStorage.getItem("token");
    const storedPendingEmail = localStorage.getItem("pendingVerificationEmail");

    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken)
        .catch((error) => {
          // Si el token es inválido, limpiarlo
          console.error("Token inválido, limpiando:", error);
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // ✅ CRÍTICO: Terminar loading aunque no haya token
    }

    if (storedPendingEmail) {
      setPendingVerificationEmail(storedPendingEmail);
    }
  }, []);

  const login = async (identifier, password) => {
    try {
      const data = await loginAPI(identifier, password);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      await loadUser(data.access_token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);

      // ✅ Si es cuenta no verificada, marcar que necesita nuevo código
      if (error.message.includes("no verificada") || error.message.includes("not verified")) {
        localStorage.setItem("needsNewCode", "true");
      }

      throw error;
    }
  };

  // ✅ NUEVO: Registro sin login automático (requiere verificación)
  const register = async (email, password) => {
    try {
      const data = await registerAPI(email, password);

      // Guardar email pendiente de verificación
      localStorage.setItem("pendingVerificationEmail", data.email);
      setPendingVerificationEmail(data.email);

      //console.log("✅ Usuario registrado, email pendiente de verificación:", data.email);

      // NO guardar token aún, NO cargar usuario
      // El usuario debe verificar primero
      return data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  // ✅ NUEVO: Verificar email y hacer login automático
  const verifyEmail = async (email, code) => {
    try {
      const data = await verifyEmailAPI(email, code);

      // Ahora sí, guardar token y cargar usuario
      localStorage.setItem("token", data.access_token);
      localStorage.removeItem("pendingVerificationEmail");

      setToken(data.access_token);
      setPendingVerificationEmail(null);

      await loadUser(data.access_token);

      //console.log("✅ Email verificado y usuario autenticado");

      return data;
    } catch (error) {
      console.error("Error verificando email:", error);
      throw error;
    }
  };

  // ✅ NUEVO: Reenviar código de verificación
  const resendVerificationCode = async (email) => {
    try {
      const data = await resendCodeAPI(email);
      //console.log("✅ Código reenviado a:", email);
      return data;
    } catch (error) {
      console.error("Error reenviando código:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pendingVerificationEmail");
    setToken(null);
    setUser(null);
    setPendingVerificationEmail(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,  // ✅ Exponer setToken
        user,
        login,
        register,
        verifyEmail,  // ✅ Nueva función
        resendVerificationCode,  // ✅ Nueva función
        logout,
        loading,
        pendingVerificationEmail  // ✅ Nuevo estado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
