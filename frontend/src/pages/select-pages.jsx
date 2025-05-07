import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from '@/common/ThemeToggle';

export default function SelectPagesStep() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [pdfUrl, setPdfUrl] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(0);
  const [nivelDificultad, setNivelDificultad] = useState('');
  const [paginasSeleccionadas, setPaginasSeleccionadas] = useState(''); // string para simplificar por ahora

  useEffect(() => {
    const pdf = localStorage.getItem('pdfUrl');
    const preguntas = localStorage.getItem('numeroPreguntas');
    const dificultad = localStorage.getItem('nivelDificultad');

    if (!pdf || !preguntas || !dificultad) {
      alert("Faltan datos para continuar. Regresando al inicio.");
      router.push('/');
      return;
    }

    setPdfUrl(pdf);
    setNumeroPreguntas(Number(preguntas));
    setNivelDificultad(dificultad);
  }, []);

  const handleContinuar = () => {
    if (!paginasSeleccionadas) {
      alert("Selecciona al menos una página para continuar.");
      return;
    }

    localStorage.setItem('paginasSeleccionadas', paginasSeleccionadas);
    router.push('/test');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      <ThemeToggle />

      <h1 className="text-3xl font-bold mb-4 text-center">Selecciona las páginas del PDF 📄</h1>

      <p className="mb-2"><strong>PDF:</strong> <code className="break-all">{pdfUrl}</code></p>
      <p className="mb-1"><strong>Número de preguntas:</strong> {numeroPreguntas}</p>
      <p className="mb-4"><strong>Dificultad:</strong> {nivelDificultad}</p>

      {/* Simulación de selección de páginas */}
      <div className="w-full max-w-md mb-6">
        <label className="block mb-2 font-semibold">Ingresa las páginas que deseas procesar (ej: 1,2,4):</label>
        <input
          type="text"
          value={paginasSeleccionadas}
          onChange={(e) => setPaginasSeleccionadas(e.target.value)}
          className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
          placeholder="Ej: 1,2,5-7"
        />
      </div>

      <button
        onClick={handleContinuar}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
      >
        Continuar al Test ➡️
      </button>
    </div>
  );
}
