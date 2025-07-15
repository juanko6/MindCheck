import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import { pdfjs } from 'react-pdf';
import PDFViewer from '@/components/select-pages/PDFViewer';
import PageSelectionFooter from '@/components/select-pages/PageSelectionFooter';
import { useAuth } from "@/context/AuthContext";
import { generateTest } from "@/services/testService";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ModeButton from '@/components/select-pages/ModeButton';


pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

export default function SelectPagesStep() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { token, user, loading } = useAuth();

  const [pdfUrl, setPdfUrl] = useState('');
  const [nivelDificultad, setNivelDificultad] = useState("Modo Relax");
  const [numPages, setNumPages] = useState(null);
  const [paginasSeleccionadas, setPaginasSeleccionadas] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [zoom, setZoom] = useState(200);

  const modos = [
    { label: "Modo Relax", image: "/assets/dashboard/modo-relax.svg", preguntas: 7 },
    { label: "Modo Café", image: "/assets/dashboard/modo-cafe.svg", preguntas: 15 },
    { label: "Modo Insano", image: "/assets/dashboard/modo-insano.svg", preguntas: 21 },
    { label: "Modo Leyenda", image: "/assets/dashboard/modo-leyenda.svg", preguntas: 25 },
  ];


  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
      return;
    }

    const queryPdfUrl = router.query.pdfUrl;
    const queryPath = router.query.path;

    if (!queryPdfUrl || !queryPath) {
      alert("Faltan datos para continuar. Regresando al inicio.");
      router.push('/client/upload');
      return;
    }

    setPdfUrl(queryPdfUrl);
    setPath(queryPath);
  }, [loading, token, router]);

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

      const preguntasPorModo = modos.find(m => m.label === nivelDificultad)?.preguntas || 7;

      const response = await generateTest({
        pdf_url: path,
        paginas: paginasSeleccionadas,
        numero_preguntas: preguntasPorModo,
        dificultad: nivelDificultad,
      }, token);
      console.log("direccion pdf_url:", path);

      const testId = response.testId;


      router.push(`/client/test?testId=${testId}`);
    } catch (error) {
      console.error("Error generando test:", error);
      alert("Ocurrió un error al generar el test. Intenta nuevamente.");
    }
  };

  const handleToBack = () => {
    router.back();
  };

  if (loading || !token || !user) {
    return <div className="text-white text-center mt-10">Cargando...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      <div className="mb-8 w-full max-w-4xl">
        <h3 className="text-xl rubik-semibold mb-4 text-left">Que no te evalúe el caos.</h3>
        <h3 className="text-md rubik-regular mb-4 text-left -mt-3">Escoge las páginas más jugosas y ajusta el nivel. Aquí el examen se toma con cabeza fria.
        </h3>
        <div className="grid grid-cols-2 gap-4 md:flex justify-items-center md:justify-left md:gap-3 md:pt-6 md:flex-wrap">
          {modos.map((modo) => (
            <ModeButton
              key={modo.label}
              label={modo.label}
              imageSrc={modo.image}
              questions={modo.preguntas}
              selected={nivelDificultad === modo.label}
              onClick={() => {
                setNivelDificultad(modo.label)
              }}
            />
          ))}
        </div>
      </div>




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

      <PageSelectionFooter
        onCancel={handleToBack}
        onContinue={handleContinuar}
      />
    </div>
  );
}
