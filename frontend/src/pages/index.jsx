import { useState } from 'react';
import { useRouter } from 'next/router';
import DragAndDropUploader from '@/components/DragAndDropUploader';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from '@/common/ThemeToggle';

export default function HomePage() {
  const [numeroPreguntas, setNumeroPreguntas] = useState(5);
  const [nivelDificultad, setNivelDificultad] = useState("Modo Relax");
  const router = useRouter();
  const { darkMode } = useTheme();

  const handleUploadSuccess = (pdfUrl) => {
    localStorage.setItem('pdfUrl', pdfUrl);
    localStorage.setItem('numeroPreguntas', numeroPreguntas.toString());
    localStorage.setItem('nivelDificultad', nivelDificultad);
    localStorage.setItem('vidas', '5');
    localStorage.setItem('currentIndex', '0');
    router.push('/select-pages')

  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      <ThemeToggle />

      <h1 className="text-4xl font-bold mb-2 text-center">MindCheck PDF 📚</h1>
      <h2 className="text-2xl font-semibold mb-8 text-center">¡Pon a prueba tu mente! 🧠</h2>

      {/* Selector de número de preguntas */}
      <div className="mb-8 w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4 text-center">¿Cuántas preguntas quieres?</h3>
        <div className="flex flex-col items-center">
          <input
            type="range"
            min="1"
            max="30"
            value={numeroPreguntas}
            onChange={(e) => setNumeroPreguntas(Number(e.target.value))}
            className="w-3/4 h-2 bg-blue-200 rounded-full appearance-none cursor-pointer"
          />
          <p className="mt-2 text-lg font-semibold">{numeroPreguntas} Preguntas 📚</p>
        </div>
      </div>

      {/* Selector de nivel de dificultad */}
      <div className="mb-8 w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4 text-center">¿Nivel de dificultad?</h3>
        <div className="flex justify-center">
          <select
            value={nivelDificultad}
            onChange={(e) => setNivelDificultad(e.target.value)}
            className="px-4 py-2 text-lg font-semibold border-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-400 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400 focus:ring-2 focus:ring-green-400"
          >
            <option value="Modo Relax">Modo Relax 🧘‍♂️</option>
            <option value="Modo Café">Modo Café ☕</option>
            <option value="Modo Insano">Modo Insano 👹</option>
            <option value="Modo Dios">Modo Dios 📚👑</option>
          </select>
        </div>
      </div>

      {/* Carga del PDF */}
      <DragAndDropUploader 
        onUploadSuccess={handleUploadSuccess} 
      />
    </div>
  );
}
