import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from '@/common/ThemeToggle';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { generateQuestionsFromPdf } from "@/services/api";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';



export default function SelectPagesStep() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [pdfUrl, setPdfUrl] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(0);
  const [nivelDificultad, setNivelDificultad] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [paginasSeleccionadas, setPaginasSeleccionadas] = useState([]);

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

  const handleContinuar = async () => {
    if (paginasSeleccionadas.length === 0) {
      alert("Selecciona al menos una página para continuar.");
      return;
    }
  
    try {
      const result = await generateQuestionsFromPdf(
        pdfUrl,
        paginasSeleccionadas.join(','),
        numeroPreguntas,
        nivelDificultad
      );
  
      if (!result.preguntas || result.preguntas.length === 0) {
        alert("No se generaron preguntas.");
        return;
      }
      console.log("🧪 Resultado de generateQuestionsFromPdf:", result);

      localStorage.setItem("paginasSeleccionadas", paginasSeleccionadas.join(','));
      localStorage.setItem("questions", JSON.stringify(result));
      localStorage.setItem("vidas", "5");
      localStorage.setItem("currentIndex", "0");
      console.log("📦 select-pages localStorage.questions:", localStorage.getItem("questions"));

  
      router.push('/test');
    } catch (error) {
      console.error("Error generando preguntas:", error);
      alert("Ocurrió un error al generar el test.");
    }
  };

  const handleCancelar = () => {
    router.push('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      <ThemeToggle />

      <h1 className="text-3xl font-bold mb-4 text-center">Selecciona las páginas del PDF 📄</h1>

      <p className="mb-2"><strong>PDF:</strong> <code className="break-all">{pdfUrl}</code></p>
      <p className="mb-1"><strong>Número de preguntas:</strong> {numeroPreguntas}</p>
      <p className="mb-4"><strong>Dificultad:</strong> {nivelDificultad}</p>

      {pdfUrl && (
        <Document
          file={`http://localhost:8000${pdfUrl}`}
          onLoadSuccess={handleDocumentLoadSuccess}
        >
          <div className="w-full overflow-x-auto mt-6 mb-12 px-2">
            <div className="flex flex-nowrap gap-6 p-4 border rounded-lg bg-white dark:bg-gray-800 w-fit mx-auto shadow-md">
              {Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                const isSelected = paginasSeleccionadas.includes(pageNum);
                return (
                  <div
                    key={pageNum}
                    onClick={() => togglePageSelection(pageNum)}
                    className={`flex flex-col items-center min-w-[120px] cursor-pointer transform transition
                      ${isSelected ? "border-4 border-green-500 shadow-xl" : "border border-transparent"}
                      hover:scale-105`}
                  >
                    <Page
                      pageNumber={pageNum}
                      width={100}
                      className="rounded"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Document>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleCancelar}
          className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-700 transition font-semibold"
        >
          Cancelar
        </button>

        <button
          onClick={handleContinuar}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
        >
          Continuar al Test ➡️
        </button>
      </div>
    </div>
    
  );
}
