import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Shop() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [loading, token]);

  if (loading || !user) return <div className="text-white text-center mt-10">Cargando...</div>;

  return (
    <div
      className={`min-h-screen p-6 space-y-6 transition-colors duration-500 ${
        darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Tienda</h1>

      <div
        className={`p-6 rounded-xl border-2 border-dashed text-center text-lg font-medium ${
          darkMode ? "bg-[#1F2937] text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
      >
        🚧 Esta sección está en construcción. ¡Muy pronto podrás comprar más tokens y mejoras para tu experiencia!
      </div>
    </div>
  );
}
