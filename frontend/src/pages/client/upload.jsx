import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import DragAndDropUploader from '@/components/upload-file/DragAndDropUploader';
import { useTheme } from "@/context/ThemeContext";
import CircularLoader from "@/components/common/CircularLoader";
import { useAuth } from "@/context/AuthContext";




export default function UploaderPage() {

  const router = useRouter();
  const { darkMode } = useTheme();
  const { token, loading } = useAuth();

useEffect(() => {
  if (!loading && !token) {
    router.push("/login");
  }
}, [loading, token]);

  const handleUploadSuccess = (pdfUrl) => {
    localStorage.setItem('pdfUrl', pdfUrl);
    localStorage.setItem('currentIndex', '0');
    router.push('/client/select-pages')
  };

  if (loading || !token) return <CircularLoader />;

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
