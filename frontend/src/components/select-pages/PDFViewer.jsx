import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import DashedButton from '../common/DashedButton';
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function PDFViewer({
  pdfUrl,
  numPages,
  onLoadSuccess,
  selectedPages,
  togglePageSelection,
  handleSelectAll,
  allSelected,
  zoom,
}) {
  const { darkMode } = useTheme();
  const { token } = useAuth();
  const [pdfFile, setPdfFile] = useState(null);

  // ✅ Construye la URL final del PDF
  let finalUrl = "";
  if (!pdfUrl) {
    console.warn("❌ URL PDF inválida:", pdfUrl);
  } else if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
    const isProd = process.env.ENVIRONMENT === "production";
    finalUrl = isProd ? pdfUrl.replace("http://", "https://") : pdfUrl;
  } else {
    const base = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:8000/uploads";
    finalUrl = `${base}/${pdfUrl}`;
  }

  console.log("📄 URL PDF final usada:", finalUrl);

  // ✅ Fetcher que incluye token desde el contexto
  const fetchPDFWithAuth = async (url) => {
    if (!token) {
      console.warn("⚠️ Token no disponible en contexto.");
      return null;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("❌ Error al obtener PDF:", response.status);
        return null;
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("❌ Error en fetch:", error);
      return null;
    }
  };

  useEffect(() => {
    if (finalUrl && token) {
      fetchPDFWithAuth(finalUrl).then((blob) => {
        if (blob) setPdfFile(blob);
      });
    }
  }, [finalUrl, token]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-sm rubik-light">
          {selectedPages.length} página{selectedPages.length !== 1 ? 's' : ''} seleccionada{selectedPages.length !== 1 ? 's' : ''}
        </span>
        <DashedButton
          withBorder={false}
          bgColor="bg-blue-400 hover:bg-blue-500"
          textColor='text-white'
          onClick={handleSelectAll}
        >
          {allSelected ? 'Deseleccionar todas' : 'Selecciona Todas'}
        </DashedButton>
      </div>

      <div className={`overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
        w-full px-2 rounded-lg shadow-inner border-[5px] border-dashed border-gray-400 rounded-2xl p-8 text-center transition-colors duration-300
        ${darkMode ? "bg-[#0B1120]" : "text-gray-900"}`}
      >
        {pdfFile ? (
          <Document file={pdfFile} onLoadSuccess={onLoadSuccess}>
            <div className="grid grid-cols-1 md:flex md:w-fit gap-4 py-1">
              {Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                const isSelected = selectedPages.includes(pageNum);
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
                      width={zoom}
                      className="rounded"
                    />
                  </div>
                );
              })}
            </div>
          </Document>
        ) : (
          <p className="text-center text-red-500 py-4">❌ No se pudo cargar el PDF.</p>
        )}
      </div>
    </div>
  );
}
