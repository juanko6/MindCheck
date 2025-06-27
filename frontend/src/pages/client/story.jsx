import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { fetchTestHistory } from "@/services/testService";
import { useTheme } from "@/context/ThemeContext"; // ✅ NUEVO

export default function TestHistory() {
  const { token, user, loading } = useAuth();
  const { darkMode } = useTheme(); // ✅ NUEVO
  const router = useRouter();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.push("/login");
      return;
    }

    const loadTests = async () => {
      try {
        const data = await fetchTestHistory(token);
        console.log("Tests recibidos:", data);
        const sortedData = data
          .filter((test) => test.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTests(sortedData);
      } catch (err) {
        console.error("Error al cargar los tests:", err);
      }
    };

    loadTests();
  }, [loading, token]);

  if (loading || !token || !user) {
    return <div className="text-white text-center mt-10">Cargando historial...</div>;
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">🕓 Historial de Resultados</h1>

      {tests.length === 0 ? (
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center mt-10`}>
          Aún no has realizado ningún test.
        </p>
      ) : (
        <div className="space-y-6">
          {/* Versión de tarjetas para móviles */}
          <div className="block md:hidden space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                  {new Date(test.created_at).toLocaleString()}
                </p>
                <h2 className="text-lg font-semibold mt-1">{test.title}</h2>

                {typeof test.porcentaje === "number" && (
                  <p className="text-green-500 mt-2">✅ {test.porcentaje}%</p>
                )}

                <button
                  onClick={() => router.push(`/client/test?testId=${test.test_id}`)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
                >
                  Ver detalle
                </button>
              </div>
            ))}
          </div>

          {/* Versión de tabla para escritorio */}
          <div className="hidden md:block">
            <table className="text-left table-auto border-collapse">
              <thead>
                <tr className={`${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Título</th>
                  <th className="p-3">Porcentaje</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr
                    key={test.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-600 hover:bg-gray-800"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <td className="p-3">{new Date(test.created_at).toLocaleString()}</td>
                    <td className="p-3">{test.title}</td>
                    <td className="p-3 text-green-500">{test.porcentaje}%</td>
                    <td className="p-3">
                      <button
                        onClick={() => router.push(`/client/test?testId=${test.test_id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
