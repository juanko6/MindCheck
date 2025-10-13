import { useState } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { uploadPDF } from "@/services/api";
import Image from "next/image";
import DashedButton from '../common/DashedButton';

export default function DragAndDropUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { darkMode } = useTheme();
  const router = useRouter();
  const { token } = useAuth();

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
    if (!file || !token) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {
      const { fileUrl, path, documentId } = await uploadPDF(file, token, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      if (!fileUrl || !path || !documentId) {
        alert("❌ Error: datos incompletos al subir el archivo.");
        return;
      }

      //console.log("📄📄📄📄 Upload Response: ", { fileUrl, path, documentId });
      onUploadSuccess({ fileUrl, path, documentId }); // ✅ pasas todo
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
        className={`border-[5px] border-dashed border-gray-400 rounded-2xl p-8 w-full text-center transition-colors duration-300
          ${darkMode ? "bg-[#0B1120] hover:bg-gray-600" : "bg-gray-300 text-gray-900"}`}
      >
        {/* Input oculto */}
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="file-upload" />

        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
          <Image src="/assets/dashboard/ic-upload.svg" alt="Upload" width={50} height={50} />

          {file ? (
            <p className="text-base rubik-semibold text-green-700">
              Archivo seleccionado: {file.name}
            </p>
          ) : (
            <p className="text-base rubik-regular">
              Arrastra tu documento aquí o haz clic para seleccionarlo
            </p>
          )}

          {/* Botones separados */}

          <div className="flex gap-4 mt-4">

            <DashedButton
              onClick={handleUpload}
              className={`${(!file || uploading || uploadSuccess) ? "opacity-50 cursor-not-allowed" : ""}`}
              withBorder={false}
              bgColor="bg-gray-500 hover:bg-gray-600"
              textColor="text-white"
            >
              Subir
            </DashedButton>
            <label
              htmlFor="file-upload"
              className="px-6 py-2 rounded-md font-semibold text-sm shadow-sm bg-gray-500 hover:bg-gray-600 text-white cursor-pointer"
            >
              Explora
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
      <div className="mt-6 w-full flex justify-start">
        <DashedButton
          onClick={() => router.back()}
          withBorder={false}
          bgColor="bg-gray-500 hover:bg-gray-600"
          textColor="text-white"
        >
          Regresar
        </DashedButton>
      </div>

    </div>
  );
}
