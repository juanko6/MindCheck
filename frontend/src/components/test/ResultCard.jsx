// components/ResultCard.jsx
import { useRouter } from "next/router";

export default function ResultCard({ total, correctas, porcentaje, mensajeFinal, onRetry }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <h1 className="text-4xl font-bold mb-6">🎉 ¡Test completado!</h1>

      <div className="p-6 rounded-lg shadow-lg text-center mb-8 w-full max-w-md bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">Resultados</h2>
        <p className="text-lg">Correctas: {correctas} / {total}</p>
        <p className="text-lg">Porcentaje: {porcentaje}%</p>
        <p className="text-2xl mt-4">{mensajeFinal}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          className="p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center font-semibold text-2xl cursor-pointer transition-all duration-300 hover:scale-105"
        >
          🚀 Nuevo Test
          <p className="text-base mt-2 font-normal">Sube otro PDF y empieza de nuevo.</p>
        </div>

        <div
          onClick={onRetry}
          className="p-8 bg-green-500 hover:bg-green-600 text-white rounded-lg text-center font-semibold text-2xl cursor-pointer transition-all duration-300 hover:scale-105"
        >
          🔄 Repetir Test
          <p className="text-base mt-2 font-normal">Usa las mismas preguntas otra vez.</p>
        </div>
      </div>
    </div>
  );
}
