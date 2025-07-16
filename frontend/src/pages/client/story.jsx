import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { fetchTestHistory } from "@/services/testService";
import { useTheme } from "@/context/ThemeContext";
import DashedButton from "@/components/common/DashedButton";


export default function TestHistory() {
  const { token, user, loading } = useAuth();
  const { darkMode } = useTheme();
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
        //console.log("Tests recibidos:", data);
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
      className={`min-h-screen p-6 transition-colors duration-500 ${darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"
        }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-center rubik-semibold-italic">
        Historial de Resultados
      </h1>

      {tests.length === 0 ? (
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center mt-10`}>
          Aún no has realizado ningún test.
        </p>
      ) : (
        <div className="space-y-6">
          {/* Versión móvil (tarjetas) */}
          <div className="block md:hidden space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-2xl shadow-sm rubik-italic ${darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
              >
                <p className="text-sm text-gray-400">
                  {new Date(test.created_at).toLocaleString()}
                </p>
                <h2 className="text-sm font-semibold mt-1">{test.title}</h2>

                {typeof test.porcentaje === "number" && (
                  <p className="text-xl text-green-500 mt-2 mb-2">✅ {test.porcentaje}%</p>
                )}

                <DashedButton
                  onClick={() => router.push(`/client/test?testId=${test.id}`)}
                  bgColor="bg-yellow-400"
                  textColor="text-black"
                  
                >
                  Repetir Test
                </DashedButton>
              </div>
            ))}
          </div>

          {/* Versión escritorio (tabla) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden text-sm rubik-italic">
              <thead>
                <tr className="bg-yellow-400 text-gray-900 text-left rubik-semibold-italic">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Título</th>
                  <th className="p-4">Porcentaje</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              
              <tbody className={`w-full px-3 py-2 border-2 border-dashed rounded ${darkMode ? "bg-[#1F2937] text-white" : "bg-gray-50 text-gray-900"
                                }`}>
                {tests.map((test) => (
                  <tr
                    key={test.id}
                    className={`border-t ${darkMode
                        ? "border-gray-600 hover:bg-gray-500"
                        : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <td className="p-4">{new Date(test.created_at).toLocaleString()}</td>
                    <td className="p-4">{test.title}</td>
                    <td className="p-4 text-green-500">{test.porcentaje}%</td>
                    <td className="p-4">
                      <DashedButton
                        onClick={() => router.push(`/client/test?testId=${test.id}`)}
                        bgColor="bg-yellow-400"
                        textColor="text-black"
                        className="text-sm"
                        withBorder={false}
                      >
                        Repetir Test
                      </DashedButton>
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