// pages/login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import CircularLoader from "@/components/common/CircularLoader";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(identifier, password);
      setLoading(false);
      
      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Inicio de sesión exitoso",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setLoading(false);
      console.error("Error en login:", err);
      
      // ✅ DETECTAR SI ES ERROR DE CUENTA NO VERIFICADA
      if (err.message.includes("no verificada") || err.message.includes("not verified")) {
        Swal.fire({
          icon: "warning",
          title: "Cuenta no verificada",
          text: "Debes verificar tu email antes de iniciar sesión. ¿Deseas recibir un nuevo código?",
          showCancelButton: true,
          confirmButtonText: "Sí, enviar código",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#10b981",
        }).then((result) => {
          if (result.isConfirmed) {
            // Guardar email y redirigir a verificación
            localStorage.setItem("pendingVerificationEmail", identifier);
            router.push("/verify-email");
          }
        });
      } else {
        // Otros errores (credenciales incorrectas, etc.)
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: err.message || "Credenciales incorrectas",
        });
      }
      
      setError(err.message);
    }
  };

  return (
    <>
      {loading && <CircularLoader />}

      <div className="min-h-screen bg-[#F1F3F9] flex items-center justify-center px-4">
        <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl rounded-2xl overflow-hidden shadow-lg bg-white">
          {/* Logo */}
          <Link href="/" className="w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-[#BDC6D3] flex items-center justify-center p-8 md:p-12 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            <div className="w-40 md:w-60 cursor-pointer">
              <Image
                src="/assets/logo-mindcheck.png"
                alt="MindCheck Logo"
                layout="responsive"
                width={220}
                height={220}
                priority
              />
            </div>
          </Link>

          {/* Formulario de login */}
          <div className="w-full md:w-2/3 bg-[#909DB1] p-6 md:p-10 flex flex-col justify-center rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">
              Iniciar Sesión
            </h2>

            {error && (
              <p className="bg-red-500 text-white text-center p-2 rounded mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Email Institucional o Usuario"
                className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-semibold border border-blue-700 shadow-sm transition disabled:opacity-50"
              >
                Iniciar Sesión
              </button>
            </form>

            <button
              onClick={() => alert("Login con Google aún no implementado")}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#D0D5DC] hover:bg-gray-300 text-black py-3 px-4 rounded shadow-sm"
            >
              <Image src="/assets/google-icon.png" alt="Google" width={20} height={20} />
              Inicia sesión con Google
            </button>

            <p className="mt-4 text-center text-sm text-black">
              ¿No tienes cuenta?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Regístrate
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
