import { useState } from 'react';
import DragAndDropUploader from '../components/DragAndDropUploader';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [numeroPreguntas, setNumeroPreguntas] = useState(5);
  const [nivelDificultad, setNivelDificultad] = useState("Modo Relax");
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleUploadSuccess = (preguntasGeneradas) => {
    localStorage.setItem('questions', JSON.stringify(preguntasGeneradas));
    router.push('/test');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 font-bold py-2 px-4 rounded transition-colors duration-500
          ${darkMode ? "bg-yellow-400 hover:bg-yellow-500 text-black" : "bg-purple-600 hover:bg-purple-800 text-white"}`}
      >
        {darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
      </button>

      <h1 className="text-4xl font-bold mb-2 text-center">MindCheck PDF 📚</h1>
      <h2 className="text-2xl font-semibold mb-8 text-center">¡Pon a prueba tu mente! 🧠</h2>

      {/* Cartas de Número de Preguntas */}
      <div className="mb-8 w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4 text-center">¿Cuántas preguntas quieres?</h3>
        <div className="grid grid-cols-2 gap-4">
          {[5, 10, 15, 20].map((n) => (
            <div
              key={n}
              onClick={() => setNumeroPreguntas(n)}
              className={`p-6 rounded-lg text-center font-semibold border-2 cursor-pointer transition-all duration-300
                ${numeroPreguntas === n 
                  ? "bg-blue-500 text-white border-blue-600 scale-105" 
                  : "border-gray-400 hover:border-blue-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700"
                }`}
            >
              {n} Preguntas 📚
            </div>
          ))}
        </div>
      </div>

      {/* Cartas de Nivel de Dificultad */}
      <div className="mb-8 w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4 text-center">¿Nivel de dificultad?</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { nivel: "Modo Relax", emoji: "🧘‍♂️" },
            { nivel: "Modo Café", emoji: "☕" },
            { nivel: "Modo Insano", emoji: "👹" },
            { nivel: "Modo Dios", emoji: "📚👑" }
          ].map(({ nivel, emoji }) => (
            <div
              key={nivel}
              onClick={() => setNivelDificultad(nivel)}
              className={`p-6 rounded-lg text-center font-semibold border-2 cursor-pointer transition-all duration-300
                ${nivelDificultad === nivel 
                  ? "bg-green-500 text-white border-green-600 scale-105" 
                  : "border-gray-400 hover:border-green-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-green-400 dark:hover:bg-gray-700"
                }`}
            >
              {nivel} {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Drag & Drop */}
      <DragAndDropUploader 
        onUploadSuccess={handleUploadSuccess} 
        numeroPreguntas={numeroPreguntas}
        nivelDificultad={nivelDificultad}
      />
    </div>
  );
}
