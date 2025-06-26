// components/landing-page/Footer.jsx

import { useState } from "react";
import { useRouter } from "next/router";
import DashedButton from "../common/DashedButton";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (path) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <footer className="w-full bg-white border-t border-gray-300 px-6 py-10">
      <div className="max-w-screen-xl mx-auto flex flex-wrap md:flex-nowrap justify-between gap-x-6 gap-y-10 items-start">

        {/* Sección izquierda: texto y botón */}
        <div className="w-full md:w-1/3 px-2">
          <p className="italic text-gray-800 text-left text-xl leading-snug mb-4">
            <span className="rubik-light-italic">Deja de acumular apuntes. </span>
            <span className="rubik-light-italic">Empieza a convertirlos en conocimiento real.</span>
          </p>

          <DashedButton
            fullWidth={true}
            className="hover:bg-yellow-300 w-full"
            onClick={() => go("/register")}
          >
            Regístrate
          </DashedButton>
        </div>

        {/* Sección central: enlaces */}
        <div className="w-full md:w-1/2 bg-[#f4f4f5] rounded-md px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="rubik-italic text-sm mb-2">MindCheck</p>
            <ul className="rubik-light text-sm space-y-1 text-gray-800">
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Características</a></li>
              <li><a href="#">Precios</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <p className="rubik-italic text-sm mb-2">Recursos</p>
            <ul className="rubik-light text-sm space-y-1 text-gray-800">
              <li><a href="#">Centro de ayuda</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
          <div>
            <p className="rubik-italic text-sm mb-2">Empresa</p>
            <ul className="rubik-light text-sm space-y-1 text-gray-800">
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Prensa</a></li>
              <li><a href="#">Trabaja con nosotros</a></li>
              <li><a href="#">Legal & Privacidad</a></li>
            </ul>
          </div>
        </div>

        {/* Sección derecha: redes sociales */}
        <div className="w-full md:w-[120px] bg-[#f4f4f5] rounded-md py-4 px-4 flex flex-col items-start md:items-center justify-start gap-3">
          <p className="rubik-italic text-sm text-gray-700">Síguenos</p>
          <div className="flex flex-row md:flex-col gap-4 mt-2">
            <img src="/assets/ic-instagram.svg" alt="Instagram" className="w-6 h-6" />
            <img src="/assets/ic-linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
            <img src="/assets/ic-x.svg" alt="X/Twitter" className="w-6 h-6" />
            <img src="/assets/ic-youtube.svg" alt="YouTube" className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Footer bottom */}
      <div className="text-center text-sm text-gray-600 mt-10 rubik-light">
        <p>
          &copy; 2025 <strong>juanko6</strong> • Hecho con <span className="text-red-500">❤</span> & muuucho café en Europa/Alicante
        </p>
      </div>
    </footer>
  );
}
