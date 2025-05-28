import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetch("http://localhost:8000/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(setUserData)
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  if (!userData) return <div className="text-white text-center mt-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bienvenido a MindCheck 🎓</h1>
        <div className="flex items-center gap-4">
          <span className="bg-yellow-400 text-black font-semibold py-1 px-3 rounded-full">
            🪙 Tokens: 300
          </span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">👤 Información del Usuario</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Rol:</strong> {userData.role}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">📝 Opciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/client/upload")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Crear nuevo test
          </button>
          <button
            onClick={() => router.push("story")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Ver test anteriores
          </button>
        </div>
      </section>
    </div>
  );
}
