// components/dashboard/Sidebar.jsx

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "@/context/ThemeContext";

const menuItems = [
  { icon: "/assets/dashboard/ic-home.svg", label: "Inicio", route: "/dashboard" },
  { icon: "/assets/dashboard/ic-brain.svg", label: "Generar", route: "/client/upload" },
  { icon: "/assets/dashboard/ic-profile.svg", label: "Perfil", route: "/client/profile" },
  { icon: "/assets/dashboard/ic-results.svg", label: "Resultados", route: "/dashboard/story" },
  { icon: "/assets/dashboard/ic-shop.svg", label: "Tienda", route: "/client/shop" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true); // default: plegado
  const router = useRouter();
  const { darkMode } = useTheme();

  // Forzar expandido en pantallas medianas hacia arriba
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    handleResize(); // estado inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`flex flex-col justify-between transition-all duration-300 shadow-md
        ${collapsed ? "w-16" : "w-64"}
        ${darkMode ? "bg-[#0B1120] text-white" : "bg-[#f3f4f6] text-gray-800"}`}
    >
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Image
          src={collapsed ? "/assets/dashboard/logo-mindcheck-brain.svg" : "/assets/logohoriz.svg"}
          alt="MindCheck"
          width={collapsed ? 32 : 140}
          height={40}
        />
      </div>

      {/* Toggle Button (solo visible desde md) */}
      <div className="flex justify-end px-2 md:visible invisible">
        <button onClick={toggleSidebar}>
          <Image
            src="/assets/dashboard/toggle-menu.svg"
            alt="Toggle Menu"
            width={24}
            height={24}
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

        {/* Menú */}
        <nav className="mt-4 space-y-2 px-2 flex-1">
            {menuItems.map((item, index) => {
                const isActive = router.pathname === item.route;

                return (
                    <button
                        key={index}
                        onClick={() => router.push(item.route)}
                        className={`flex items-center gap-3 px-3 py-2 rounded transition-all w-full
                        ${isActive ? "text-white bg-gray-300 dark:bg-gray-500" : ""}
                        md:hover:bg-gray-200 md:dark:hover:bg-gray-400`}
                    >
                    <div className="min-w-[24px] flex justify-center">
                        <Image src={item.icon} alt={item.label} width={24} height={24} />
                    </div>
                    {!collapsed && <span className="text-sm text-left">{item.label}</span>}
                    </button>
                );
            })}

        </nav>

      {/* Feedback */}
      <div className="py-4 px-2 flex justify-center">
        <Image
          src="/assets/dashboard/ic-feedback.svg"
          alt="Feedback"
          width={collapsed ? 32 : 50}
          height={32}
        />
      </div>
    </aside>
  );
}
