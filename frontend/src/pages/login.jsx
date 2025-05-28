import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError("Correo o contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Iniciar Sesión</h2>
        {error && <p className="bg-red-500 text-white text-center p-2 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo institucional"
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-semibold"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}
