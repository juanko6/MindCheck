import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from '@/common/ThemeToggle';
import { Document, Page, pdfjs } from 'react-pdf';
import QuestionCountSelector from '@/components/QuestionCountSelector';
import DifficultySelector from '@/components/DifficultySelector';
import PDFViewer from '@/components/PDFViewer';
import PageSelectionFooter from '@/components/PageSelectionFooter';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';



export default function SelectPagesStep() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [pdfUrl, setPdfUrl] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(5);
  const [nivelDificultad, setNivelDificultad] = useState("Modo Relax");
  const [numPages, setNumPages] = useState(null);
  const [paginasSeleccionadas, setPaginasSeleccionadas] = useState([]);
  const [allSelected, setAllSelected] = useState(false);


  useEffect(() => {
    const pdf = localStorage.getItem('pdfUrl');
    const preguntas = localStorage.getItem('numeroPreguntas');
    const dificultad = localStorage.getItem('nivelDificultad');

    if (!pdf) {
      alert("Faltan datos para continuar. Regresando al inicio.");
      router.push('/');
      return;
    }

    setPdfUrl(pdf);
    setNumeroPreguntas(Number(preguntas) || 5);
    setNivelDificultad(dificultad || "Modo Relax");
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


  const handleContinuar = () => {
    if (paginasSeleccionadas.length === 0) {
      alert("Selecciona al menos una página para continuar.");
      return;
    }
  
    // Solo guarda parámetros
    localStorage.setItem("pdfUrl", pdfUrl);
    localStorage.setItem("paginasSeleccionadas", paginasSeleccionadas.join(','));
    localStorage.setItem("numeroPreguntas", numeroPreguntas);
    localStorage.setItem("nivelDificultad", nivelDificultad);
  
    router.push("/test"); // Navega inmediatamente
  };

  const handleCancelar = () => {
    router.push('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      <ThemeToggle />

      <h1 className="text-3xl font-bold mb-4 text-center">Selecciona las páginas del PDF 📄</h1>

      {/*       <p className="mb-2"><strong>PDF:</strong> <code className="break-all">{pdfUrl}</code></p>
      <p className="mb-1"><strong>Número de preguntas:</strong> {numeroPreguntas}</p>
      <p className="mb-4"><strong>Dificultad:</strong> {nivelDificultad}</p> */}

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
        />
      )}

      <PageSelectionFooter
        onCancel={handleCancelar}
        onContinue={handleContinuar}
      />
    </div>

  );
}
