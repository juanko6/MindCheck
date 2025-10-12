import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/dashboard/Layout";
import { useTheme } from "@/context/ThemeContext"; // ✅ NUEVO

export default function Profile() {
    const { token, user, logout, loading } = useAuth();
    const [tab, setTab] = useState("datos");
    const router = useRouter();
    const { darkMode } = useTheme(); // ✅ NUEVO

    useEffect(() => {
        if (!loading && !token) router.push("/login");
    }, [loading, token]);

    if (loading || !user) return <div className="text-white text-center mt-10">Cargando...</div>;

    return (
        <div
            className={`min-h-screen p-6 space-y-6 transition-colors duration-500 ${darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"
                }`} // ✅ MODIFICADO
        >
            {/* Tabs */}
            <div className="flex gap-6 border-b pb-2">
                <button
                    className={`pb-1 border-b-2 flex items-center gap-2 rubik-light-italic ${tab === "datos" ? "border-white rubik-semibold-italic" : "border-transparent"
                        }`}
                    onClick={() => setTab("datos")}
                >
                    <img src="/assets/dashboard/ic-profile.svg" className="w-5 h-5" />
                    Datos Personales
                </button>
                <button
                    className={`pb-1 border-b-2 rubik-light-italic ${tab === "suscripcion" ? "border-white rubik-semibold-italic" : "border-transparent"
                        }`}
                    onClick={() => setTab("suscripcion")}
                >
                    Mi Suscripción
                </button>
            </div>

            {/* Formulario de datos personales */}
            {tab === "datos" && (
                <div className="space-y-4 max-w-sm">
                    <div>
                        <label className="text-xs">Usuario</label>
                        <input
                            disabled
                            className={`w-full px-3 py-2 border-2 border-dashed rounded ${darkMode ? "bg-[#1F2937] text-white" : "bg-gray-50 text-gray-900"
                                }`} // ✅ MODIFICADO
                            value={user.username || ""}
                        />
                    </div>
                    <div>
                        <label className="text-xs">Nombre</label>
                        <input
                            disabled
                            className={`w-full px-3 py-2 border-2 border-dashed rounded ${darkMode ? "bg-[#1F2937] text-white" : "bg-gray-50 text-gray-900"
                                }`}
                            value={user.first_name || ""}
                        />
                    </div>
                    <div>
                        <label className="text-xs">Apellido</label>
                        <input
                            disabled
                            className={`w-full px-3 py-2 border-2 border-dashed rounded ${darkMode ? "bg-[#1F2937] text-white" : "bg-gray-50 text-gray-900"
                                }`}
                            value={user.last_name || ""}
                        />
                    </div>
                    <div>
                        <label className="text-xs">Correo Electrónico</label>
                        <input
                            disabled
                            className={`w-full px-3 py-2 border-2 border-dashed rounded ${darkMode ? "bg-[#1F2937] text-white" : "bg-gray-50 text-gray-900"
                                }`}
                            value={user.email || ""}
                        />
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Editar
                    </button>
                </div>
            )}

            {/* Contenido de la pestaña Mi Suscripción */}
            {tab === "suscripcion" && (
                <div className="text-sm text-gray-400">
                    Aquí puedes mostrar la información de la suscripción, plan, fecha de renovación, etc.
                </div>
            )}
        </div>
    );
}
