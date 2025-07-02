import { useState } from "react";
import Image from "next/image";

export default function ResumenPreguntas({ respuestasUsuario }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="w-full max-w-4xl">
      {/* Contenedor como un botón visual */}
      <div
        onClick={() => setExpandido(!expandido)}
        className="cursor-pointer border-[5px] border-dashed border-gray-400 rounded-xl p-2 transition"
      >
        <div className="flex items-center justify-between px-2 py-1">
          {/* Ícono ilustrado */}
          <div className="flex items-center gap-3">
            <div className="bg-[#f2f7fa] p-2 rounded-md flex items-center justify-center">
              <Image
                src="/assets/dashboard/ic-review.svg"
                alt="Revisión icon"
                width={60}
                height={60}
              />
            </div>
            <p className="rubik-semibold text-lg">
              Revisión detallada de tu genialidad
            </p>
          </div>

          {/* Botón derecho */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // evita que el contenedor lo dispare 2 veces
              setExpandido(!expandido);
            }}
            className="text-2sm rubik-regular bg-gray-500 px-4 py-1 rounded shadow hover:bg-gray-400 transition"
          >
            {expandido ? "Ocultar ▾" : "Mostrar >"}
          </button>
        </div>
      </div>

      {/* Contenido expandido */}
      {expandido && (
        <div className="space-y-4 mt-6 animate-fadeSlideIn">
          {respuestasUsuario.map((res, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg shadow-md transition-all duration-300 border-2 ${
                res.fueCorrecta
                  ? "border-green-500 bg-green-800/30"
                  : "border-red-500 bg-red-800/30"
              }`}
            >
              <p className="rubik-semibold mb-2">❓ {res.pregunta}</p>
              <ul className="list-disc ml-5 space-y-1">
                {res.opciones.map((opcion, index) => (
                  <li
                    key={index}
                    className={`
                      ${index === res.correcta ? "rubik-semibold-italic underline" : ""}
                      ${index === res.seleccionada ? "rubik-semibold-italic text-blue-700" : ""}
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
