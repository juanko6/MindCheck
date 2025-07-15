import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import DragAndDropUploader from '@/components/upload-file/DragAndDropUploader';
import CircularLoader from "@/components/common/CircularLoader";


export default function UploadFilePage() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token]);

  const handleUploadSuccess = (uploadResponse) => {
    const { fileUrl, path } = uploadResponse;

    if (!path || !fileUrl) {
      alert("Error: no se recibió la ruta del archivo.");
      return;
    }

    router.push({
      pathname: '/client/select-pages',
      query: {
        pdfUrl: fileUrl,
        path,
      },
    });
  };


  if (loading || !token) return <CircularLoader />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0B1120] text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex flex-col items-center px-6 pt-10">
        <h2 className="text-xl md:text-xl rubik-regular text-center mb-6">
          ¡Es tu turno! Usa tus propios apuntes como trampolín para mejorar. Pon a prueba tu mente!
        </h2>

        <div className="w-full max-w-3xl">
          <DragAndDropUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    </div>
  );
}
