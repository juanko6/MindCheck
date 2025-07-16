// pages/dashboard/index.jsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext"; // ✅ NUEVO

export default function Dashboard() {
  const { token, user, logout, loading } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme(); // ✅ NUEVO

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [loading, token]);


  if (loading || !user) return <div className="text-white text-center mt-10">Cargando...</div>;

  return (
    <div
      className={`min-h-screen p-6 space-y-8 transition-colors duration-500 ${darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"
        }`}
    >
      {/* Encabezado de resumen */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border-2 border-dashed text-center ${darkMode ? "bg-[#1F2937]" : "bg-gray-100"}`}>
          <p className="font-semibold text-lg mb-2">Días de Racha</p>
          <p className="text-4xl font-bold">
            1 <span className="text-base font-medium">Día</span>
          </p>
        </div>

        <div className={`p-6 rounded-xl border-2 border-dashed text-center ${darkMode ? "bg-[#1F2937]" : "bg-gray-100"}`}>
          <p className="font-semibold text-lg mb-2">Oferta en Tienda</p>
          <p className="text-4xl font-bold">
            {user.tokens} <span className="text-base font-medium">Tokens</span>
          </p>
        </div>
      </section>

      {/* Resultados históricos */}
      <section className={`p-6 rounded-xl border-2 border-dashed ${darkMode ? "bg-[#1F2937]" : "bg-gray-100"}`}>
        <h2 className="text-xl font-semibold mb-4">Resultados Históricos</h2>
        <div className={`h-48 md:h-64 flex items-center justify-center rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
          <p className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>Gráfica</p>
        </div>
      </section>
    </div>
  );
}
