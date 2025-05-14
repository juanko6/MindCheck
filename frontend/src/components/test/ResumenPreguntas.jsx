import { useState } from "react";

export default function ResumenPreguntas({ respuestasUsuario }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="mt-8 mb-8 w-full max-w-3xl">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <span>📋 Resumen por pregunta</span>
        <span>{expandido ? "🔽 Ocultar" : "▶️ Mostrar"}</span>
      </button>

      {expandido && (
        <div className="space-y-4 mt-4 animate-fadeSlideIn">
          {respuestasUsuario.map((res, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg shadow-md transition-all duration-300 border-2 ${
                res.fueCorrecta
                  ? "border-green-500 bg-green-50 dark:bg-green-800/30"
                  : "border-red-500 bg-red-50 dark:bg-red-800/30"
              }`}
            >
              <p className="font-semibold mb-2">❓ {res.pregunta}</p>
              <ul className="list-disc ml-5 space-y-1">
                {res.opciones.map((opcion, index) => (
                  <li
                    key={index}
                    className={`
                      ${index === res.correcta ? "font-bold underline" : ""}
                      ${index === res.seleccionada ? "text-blue-600 dark:text-blue-300" : ""}
                    `}
                  >
                    {opcion}
                    {index === res.correcta && " ✅ (correcta)"}
                    {index === res.seleccionada && index !== res.correcta && " ❌ (tu respuesta)"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
