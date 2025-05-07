import { useState } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { uploadPDF } from "@/services/api";

export default function DragAndDropUploader({ onUploadSuccess, numeroPreguntas, nivelDificultad }) {
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
      const data = await uploadPDF(file, numeroPreguntas, nivelDificultad, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      setUploadSuccess(true);
      setTimeout(() => {
        onUploadSuccess(data.pdfUrl);
      }, 1500);
    } catch (error) {
      console.error("Error al subir el PDF:", error);
      alert("❌ Error subiendo el archivo. Puede ser demasiado grande o hubo un problema de red.\n\nIntenta con un PDF más pequeño.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-lg p-8 mb-4 cursor-pointer transition-colors duration-500
        ${darkMode ? "border-gray-400 bg-gray-800 text-white" : "border-gray-400 bg-white text-gray-900"}`}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {file ? (
          <p className="text-lg font-semibold">{file.name}</p>
        ) : (
          <p className={`text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Arrastra tu PDF aquí o haz clic para seleccionarlo
          </p>
        )}
      </label>

      <div className="mt-4 w-full">
        <button
          onClick={handleUpload}
          disabled={!file || uploading || uploadSuccess}
          className={`flex justify-center items-center gap-2 font-bold py-2 px-4 rounded w-full transition-colors duration-500
            ${uploading || uploadSuccess ? "bg-blue-300" :
              darkMode
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }
            disabled:opacity-50`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Subiendo... {uploadProgress}%
            </>
          ) : uploadSuccess ? (
            <>
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              ¡Listo!
            </>
          ) : (
            "Subir y Generar Test"
          )}
        </button>

        {uploadSuccess && (
          <div className="mt-4 text-center text-green-500 font-bold animate-pulse">
            Subiendo conocimiento... 🧠
          </div>
        )}

        {uploading && (
          <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
