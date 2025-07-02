// components/test/ResultCard.jsx
import { useRouter } from "next/router";
import ResumenPreguntas from "./ResumenPreguntas";
import DashedButton from "../common/DashedButton";
import IconDashedButton from "../common/IconDashedButton";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ResultCard({ total, correctas, porcentaje, mensajeFinal, onRetry, respuestasUsuario = [] }) {
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>      {/* Resultado Principal */}

      <div className="border border-gray-300 rounded-xl p-6 w-full max-w-xl text-center">

        <h2 className="text-2xl rubik-semibold mb-4">¡Mente desbloqueada!</h2>

        <div className="bg-gray-500 rounded-md py-3 px-4 mb-6">
          <p className="text-xl rubik-semibold">Resultados</p>
          <p className="text-2lg rubik-regular">Acertaste {correctas} / {total}</p>
          <p className="text-2lg rubik-regular">{porcentaje}%</p>
          <p className="text-xl mt-1 rubik-semibold">{mensajeFinal}</p>
        </div>

        {/* Botón: Repetir Test */}
        <IconDashedButton
          onClick={onRetry}
          imagePath="/assets/dashboard/ic-again.svg"

          title="Una vez más… ¿te animas?"
          description="Vuelve a enfrentarte al mismo reto"
        />

        {/* Botón: Nuevo Test */}

        <div className="mt-4">
          <IconDashedButton
            onClick={() => router.push("/client/upload")}
            imagePath="/assets/dashboard/ic-newtest.svg"

            title="¡Cambia de tema, no de actitud!"
            description="¡Más conocimiento, más poder!"
          />

        </div>
      </div>

      {/* Botón: Mostrar revisión detallada */}
      <div className="mt-6 w-full max-w-xl">
        <ResumenPreguntas respuestasUsuario={respuestasUsuario} />
      </div>

    </div>
  );
}
