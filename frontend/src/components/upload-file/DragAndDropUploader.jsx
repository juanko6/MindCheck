import { useState } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { uploadPDF } from "@/services/api";
import Image from "next/image";

export default function DragAndDropUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { darkMode } = useTheme();

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {
      const data = await uploadPDF(file, null, null, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      setUploadSuccess(true);
      setTimeout(() => {
        localStorage.setItem("pdfUrl", data.pdfUrl);
        onUploadSuccess(data.pdfUrl);
      }, 1000);
    } catch (error) {
      console.error("Error al subir el PDF:", error);
      alert("❌ Error subiendo el archivo. Intenta con un PDF más pequeño.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">


      {/* Zona de carga */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-4 border-dashed rounded-2xl p-8 w-full text-center transition-colors duration-300
          ${darkMode ? "bg-gray-800 border-gray-400" : "bg-[#98A8B7] border-gray-500 text-gray-900"}`}
      >
        {/* Input oculto */}
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="file-upload" />

        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
          <Image src="/assets/dashboard/ic-upload-file.svg" alt="Upload" width={50} height={50} />

          {file ? (
            <p className="text-base font-semibold text-green-700">
              Archivo seleccionado: {file.name}
            </p>
          ) : (
            <p className="text-base font-medium">
              Arrastra tu documento aquí o haz clic para seleccionarlo
            </p>
          )}

          {/* Botones separados */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleUpload}
              disabled={!file || uploading || uploadSuccess}
              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded disabled:opacity-50"
            >
              Subir
            </button>
            <label htmlFor="file-upload">
              <div className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded cursor-pointer">
                Explora
              </div>
            </label>
          </div>
        </label>

        {/* Progreso */}
        {uploading && (
          <div className="w-full bg-gray-300 rounded-full h-2 mt-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Botón "Seguir" */}
      <button
        onClick={() => onUploadSuccess(localStorage.getItem("pdfUrl"))}
        disabled={!uploadSuccess}
        className={`mt-6 bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded transition-all duration-300
          ${!uploadSuccess ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Seguir
      </button>
    </div>
  );
}
