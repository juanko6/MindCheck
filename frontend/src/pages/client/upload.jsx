import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import DragAndDropUploader from '@/components/upload-file/DragAndDropUploader';
import { useTheme } from "@/context/ThemeContext";
import CircularLoader from "@/components/common/CircularLoader";




export default function UploaderPage() {

  const router = useRouter();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ⛔ Redirigir si no hay token de autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }


    const tokensExist = localStorage.getItem("userTokens");
    if (!tokensExist) {
      localStorage.setItem("userTokens", "300");
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handleUploadSuccess = (pdfUrl) => {
    localStorage.setItem('pdfUrl', pdfUrl);
    localStorage.setItem('currentIndex', '0');
    router.push('/select-pages')
  };

  if (loading) return <CircularLoader />;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Navbar />
      

      <h1 className="text-4xl font-bold mb-2 text-center">MindCheck PDF 📚</h1>
      <h2 className="text-2xl font-semibold mb-8 text-center">¡Pon a prueba tu mente! 🧠</h2>




      {/* Carga del PDF */}
      <DragAndDropUploader 
        onUploadSuccess={handleUploadSuccess} 
      />
    </div>
  );
}
