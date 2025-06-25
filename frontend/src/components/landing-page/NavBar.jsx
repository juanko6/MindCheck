// components/landing-page/Navbar.jsx
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";   // npm install lucide-react
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import DashedButton from "../common/DashedButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const go = (path) => {
    router.push(path);
    setOpen(false);        // cierra el menú móvil al navegar
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-white border-b border-gray-300">
      {/* ------- Barra principal ------- */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Image
          src="/assets/logohoriz.svg"
          alt="MindCheck logo"
          width={150}
          height={36}
          priority
        />

        {/* Links escritorio */}
        <nav className="hidden md:flex items-center gap-10 rubik-semibold">
          <button onClick={() => go("/")}         className="font-semibold text-gray-900 hover:text-blue-600">Inicio</button>
          <button onClick={() => go("/nosotros")} className="font-semibold text-gray-900 hover:text-blue-600">Nosotros</button>
          <button onClick={() => go("/planes")}   className="font-semibold text-gray-900 hover:text-blue-600">Planes</button>
          <button onClick={() => go("/blog")}     className="font-semibold text-gray-900 hover:text-blue-600">Blog</button>
        </nav>

        {/* Botones escritorio */}
        <div className="hidden md:flex items-center gap-3 rubik-semibold">
            <DashedButton
                bgColor="bg-transparent"
                textColor="text-gray-800"
                className="hover:bg-gray-100"
                onClick={() => go("/login")}
            >
                Iniciar Sesión
            </DashedButton>

            <DashedButton
                textColor="text-gray-800"
                className="hover:bg-yellow-300"
                onClick={() => go("/register")}
            >
                Regístrate
            </DashedButton>

        </div>

        {/* Icono menú móvil */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ------- Menú móvil desplegable ------- */}
      {open && (
        <div className="md:hidden bg-white border-t border-black/20">
          <nav className="flex flex-col items-center gap-6 py-6">
            <button onClick={() => go("/")}         className="font-semibold text-gray-900 text-lg">Inicio</button>
            <button onClick={() => go("/nosotros")} className="font-semibold text-gray-900 text-lg">Nosotros</button>
            <button onClick={() => go("/planes")}   className="font-semibold text-gray-900 text-lg">Planes</button>
            <button onClick={() => go("/blog")}     className="font-semibold text-gray-900 text-lg">Blog</button>

                        <DashedButton
                bgColor="bg-transparent"
                textColor="text-gray-800"
                className="hover:bg-gray-100"
                onClick={() => go("/login")}
            >
                Iniciar Sesión
            </DashedButton>

            <DashedButton
                textColor="text-gray-800"
                className="hover:bg-yellow-300"
                onClick={() => go("/register")}
            >
                Regístrate
            </DashedButton>
          </nav>
        </div>
      )}
    </header>
  );
}
