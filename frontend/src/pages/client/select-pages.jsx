import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import Navbar from '@/components/common/Navbar';
import { pdfjs } from 'react-pdf';
import QuestionCountSelector from '@/components/select-pages/QuestionCountSelector';
import DifficultySelector from '@/components/select-pages/DifficultySelector';
import PDFViewer from '@/components/select-pages/PDFViewer';
import PageSelectionFooter from '@/components/select-pages/PageSelectionFooter';
import { useAuth } from "@/context/AuthContext";
import { generateTest } from "@/services/testService";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

export default function SelectPagesStep() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { token, user } = useAuth();

  const [pdfUrl, setPdfUrl] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(5);
  const [nivelDificultad, setNivelDificultad] = useState("Modo Relax");
  const [numPages, setNumPages] = useState(null);
  const [paginasSeleccionadas, setPaginasSeleccionadas] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      router.push("/login");
      return;
    }

    const pdf = localStorage.getItem('pdfUrl');
    if (!pdf) {
      alert("Faltan datos para continuar. Regresando al inicio.");
      router.push('/');
      return;
    }

    setPdfUrl(pdf);
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

  const handleSelectAllPages = () => {
    if (allSelected) {
      setPaginasSeleccionadas([]);
      setAllSelected(false);
    } else {
      const allPages = Array.from({ length: numPages }, (_, i) => i + 1);
      setPaginasSeleccionadas(allPages);
      setAllSelected(true);
    }
  };

  const handleContinuar = async () => {
    if (paginasSeleccionadas.length === 0) {
      alert("Selecciona al menos una página para continuar.");
      return;
    }

    const costo = paginasSeleccionadas.length * 10;

    if (!user || user.tokens < costo) {
      alert(`No tienes suficientes tokens. Necesitas ${costo}, pero tienes ${user?.tokens || 0}.`);
      return;
    }

    try {
      const response = await generateTest({
        pdf_url: pdfUrl,
        paginas: paginasSeleccionadas,
        numero_preguntas: numeroPreguntas,
        dificultad: nivelDificultad,
      }, token);
      console.log("Enviando token:", token);

      const testId = response.testId;


      router.push(`/client/test?testId=${testId}`);
    } catch (error) {
      console.error("Error generando test:", error);
      alert("Ocurrió un error al generar el test. Intenta nuevamente.");
    }
  };

  const handleCancelar = () => {
    router.push('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Navbar />

      <h1 className="mt-20 text-3xl font-bold mb-4 text-center">Selecciona las páginas del PDF 📄</h1>

      <QuestionCountSelector 
        value={numeroPreguntas} 
        onChange={setNumeroPreguntas} 
      />
        
      <DifficultySelector 
        value={nivelDificultad} 
        onChange={setNivelDificultad} 
      />

      {pdfUrl && (
        <PDFViewer
          pdfUrl={pdfUrl}
          numPages={numPages}
          onLoadSuccess={handleDocumentLoadSuccess}
          selectedPages={paginasSeleccionadas}
          handleSelectAll={handleSelectAllPages}
          togglePageSelection={togglePageSelection}
          allSelected={allSelected}
          zoom={zoom}
        />
      )}

      <div className="flex items-center gap-4 mt-8 mb-4">
        <label className="font-medium">Zoom:</label>
        <input
          type="range"
          min="100"
          max="250"
          step="10"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-40"
        />
        <span>{zoom}%</span>
      </div>

      <PageSelectionFooter
        onCancel={handleCancelar}
        onContinue={handleContinuar}
      />
    </div>
  );
}
