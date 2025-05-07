import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from '@/common/ThemeToggle';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

export default function SelectPagesStep() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [pdfUrl, setPdfUrl] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(0);
  const [nivelDificultad, setNivelDificultad] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [paginasSeleccionadas, setPaginasSeleccionadas] = useState([]);
  const [todoSeleccionado, setTodoSeleccionado] = useState(false);

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

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const togglePageSelection = (pageNum) => {
    setPaginasSeleccionadas((prev) =>
      prev.includes(pageNum)
        ? prev.filter((n) => n !== pageNum)
        : [...prev, pageNum]
    );
  };

  const handleSeleccionarTodo = () => {
    if (todoSeleccionado) {
      setPaginasSeleccionadas([]);
    } else {
      setPaginasSeleccionadas(Array.from({ length: numPages }, (_, i) => i + 1));
    }
    setTodoSeleccionado(!todoSeleccionado);
  };

  const handleContinuar = () => {
    if (paginasSeleccionadas.length === 0) {
      alert("Selecciona al menos una página para continuar.");
      return;
    }

    localStorage.setItem('paginasSeleccionadas', paginasSeleccionadas.join(','));
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

      {numPages && (
        <button
          onClick={handleSeleccionarTodo}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          {todoSeleccionado ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
      )}

      <div className="w-full overflow-x-auto mb-6 mb-12 px-2">
        <div className="flex flex-nowrap gap-6 p-4 border rounded-lg bg-white dark:bg-gray-800 w-fit mx-auto shadow-md">
      {pdfUrl && (
          <Document
            file={`http://localhost:8000${pdfUrl}`}
            onLoadSuccess={handleDocumentLoadSuccess}
          >
            <div className="flex flex-nowrap flex-row gap-4 p-2 border rounded bg-white dark:bg-gray-800 w-fit">
              {Array.from({ length: numPages }, (_, index) => (
                <div key={index} className="flex flex-col items-center min-w-[120px]">
                  <Page
                    pageNumber={index + 1}
                    width={100}
                    className="border rounded shadow"
                  />
                  <label className="mt-2 text-sm">
                    <input
                      type="checkbox"
                      checked={paginasSeleccionadas.includes(index + 1)}
                      onChange={() => togglePageSelection(index + 1)}
                    />
                    Página {index + 1}
                  </label>
                </div>
              ))}
            </div>
          </Document>
        )}

        </div>
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
