import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { fetchUserTests } from "@/services/testService";
import { fetchUserData } from "@/services/userService";
import Layout from "@/components/dashboard/Layout";

export default function Dashboard() {
  const { token, logout, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [tests, setTests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token]);

  useEffect(() => {
    if (token) {
      fetchUserData(token)
        .then(setUserData)
        .catch(() => logout());

      fetchUserTests(token)
        .then(setTests)
        .catch((e) => console.error("Error cargando tests:", e));
    }
  }, [token]);

  if (loading || !userData) return <div className="text-white text-center mt-10">Cargando...</div>;

  return (
    <Layout>
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bienvenido a MindCheck 🎓</h1>
        <div className="flex items-center gap-4">
          <span className="bg-yellow-400 text-black font-semibold py-1 px-3 rounded-full">
            🪙 Tokens: {userData.tokens}
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
            onClick={() => router.push("/dashboard/story")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Ver Resultados anteriores
          </button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📚 Historial de Tests</h2>
        {tests.length === 0 ? (
          <p className="text-gray-400">No has generado ningún test todavía.</p>
        ) : (
          <ul className="space-y-4">
            {tests.map((test) => (
              <li key={test.id} className="bg-gray-700 p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{test.title}</p>
                    <p className="text-sm text-gray-300">
                      Fecha: {new Date(test.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/client/test?testId=${test.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Ver test
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </Layout>
  );
}
