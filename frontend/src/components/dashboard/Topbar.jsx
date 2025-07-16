import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  


  return (
    <header
    className={`px-6 h-16 flex justify-between items-center shadow-md transition-colors duration-500
        ${darkMode ? "bg-[#f3f4f6] text-gray-900" : "bg-[#0B1120] text-white"}
    `}
    >
      {/* Tokens */}
      <div className="flex items-center gap-2">
        <Image src="/assets/token-bag.svg" alt="Tokens" width={24} height={24} />
        <span className="font-semibold text-sm">
          Tokens: {user ? user.tokens : "..."}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-6">
        {/* Botón tema */}
        <button onClick={toggleDarkMode} className="w-8 h-8">
          <Image
            src={darkMode ? "/assets/dashboard/mode-clear.svg" : "/assets/dashboard/mode-dark.svg"}
            alt="Toggle Theme"
            width={32}
            height={32}
          />
        </button>

        {/* Salir */}
        <button
          onClick={logout}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          <LogOut size={20} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
