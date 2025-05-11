import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import DragAndDropUploader from '@/components/upload-file/DragAndDropUploader';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from '@/components/common/ThemeToggle';


export default function HomePage() {

  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    const tokensExist = localStorage.getItem("userTokens");
    if (!tokensExist) {
      localStorage.setItem("userTokens", "300");
    }
  }, []);

  const handleUploadSuccess = (pdfUrl) => {
    localStorage.setItem('pdfUrl', pdfUrl);
    localStorage.setItem('currentIndex', '0');
    router.push('/select-pages')

  };

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
