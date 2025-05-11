import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import PreguntaCard from "@/components/test/PreguntaCard";
import ResultCard from "@/components/test/ResultCard";
import { useTheme } from "@/context/ThemeContext";
import { getExplanation } from "@/services/api";
import { generateQuestionsFromPdf } from "@/services/api";
import TestSkeletonLoader from "@/components/test/SkeletonLoader";


export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(0); // Tokens basados en páginas seleccionadas
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const stored = localStorage.getItem("questions");
  
      if (stored) {
        const parsed = JSON.parse(stored);
        setQuestions(parsed.preguntas || []);
        setCurrentIndex(parseInt(localStorage.getItem("currentIndex")) || 0);
        setLoading(false);
        return;
      }
  
      // Si no hay preguntas, generarlas ahora
      const pdfUrl = localStorage.getItem("pdfUrl");
      const paginas = localStorage.getItem("paginasSeleccionadas");
      const numeroPreguntas = localStorage.getItem("numeroPreguntas");
      const nivelDificultad = localStorage.getItem("nivelDificultad");
  
      if (!pdfUrl || !paginas || !numeroPreguntas || !nivelDificultad) {
        alert("Faltan datos. Redirigiendo...");
        router.push("/");
        return;
      }
  
      try {
        const result = await generateQuestionsFromPdf(
          pdfUrl,
          paginas,
          parseInt(numeroPreguntas),
          nivelDificultad
        );
  
        if (!result.preguntas || result.preguntas.length === 0) {
          alert("No se pudieron generar preguntas.");
          router.push("/");
          return;
        }
  
        localStorage.setItem("questions", JSON.stringify(result));
        localStorage.setItem("currentIndex", "0");

        setQuestions(result.preguntas);
        setCurrentIndex(0);
      } catch (e) {
        alert("Error generando preguntas");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleSendAnswer = async () => {
    console.log("Selected option:", selectedOption);
    if (selectedOption === null || selectedOption === undefined) return;

    const currentQuestion = questions[currentIndex];
    if (selectedOption === currentQuestion.respuesta) {
      setFeedback("✅ ¡Correcto!");
      setIsCorrect(true);
    } else {
      const explanation = await getExplanation(currentQuestion.pregunta, 
        [currentQuestion.opcion1, currentQuestion.opcion2, currentQuestion.opcion3, currentQuestion.opcion4][currentQuestion.respuesta]
      );
      setFeedback(`❌ Incorrecto. ${explanation}`);
      setIsCorrect(false);
    }
    setShowModal(true);
  };

  const handleNextQuestion = () => {
    setShowModal(false);
    setSelectedOption(null);
    setFeedback("");
    setIsCorrect(null);
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    localStorage.setItem("currentIndex", newIndex.toString());
  };


  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    localStorage.setItem("currentIndex", "0");
  };

  if (loading) return <TestSkeletonLoader darkMode={darkMode} />;

  if (!questions.length) {
    return <p className="animate-fadeSlideIn text-center mt-10 text-red-500">❌ No se encontraron preguntas. Volviendo al inicio...</p>;
  }



  if (currentIndex >= questions.length) {
    const total = questions.length;
    const correctas = questions.filter((q, index) =>
      index < currentIndex && selectedOption === q.respuesta // simplificado
    ).length;
    const porcentaje = Math.round((correctas / total) * 100);
    let mensajeFinal = "";

    if (porcentaje >= 90) mensajeFinal = "🧠 ¡Eres un Genio Total!";
    else if (porcentaje >= 70) mensajeFinal = "🔥 ¡Muy bien, casi perfecto!";
    else if (porcentaje >= 50) mensajeFinal = "🤓 ¡Vas bien, sigue practicando!";
    else mensajeFinal = "🤡 ¡Ups! A estudiar se dijo...";

    return (
      <ResultCard
        total={total}
        correctas={correctas}
        porcentaje={porcentaje}
        mensajeFinal={mensajeFinal}
        onRetry={handleRetry}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const opciones = [
    currentQuestion.opcion1,
    currentQuestion.opcion2,
    currentQuestion.opcion3,
    currentQuestion.opcion4
  ];

  return (
    
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${darkMode ? "animate-fadeSlideIn bg-gray-900 text-white" : "animate-fadeSlideIn bg-gray-100 text-gray-900"}`}>
      <Navbar />

      <h2 className="text-2xl font-bold mb-2">{`Pregunta ${currentIndex + 1} / ${questions.length}`}</h2>
      

      <PreguntaCard
        pregunta={currentQuestion.pregunta}
        opciones={opciones}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      <button
        onClick={handleSendAnswer}
        className={`mt-6 w-full max-w-xl font-bold py-2 px-4 rounded disabled:opacity-50
          ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
          disabled={selectedOption === null}

      >
        Enviar Respuesta
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          localStorage.setItem("userTokens", tokens);
          router.push("/");
        }}
        className="mt-4 w-full max-w-xl bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Reiniciar Test
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
          <div className={`p-8 rounded-lg max-w-md w-[90%] text-center shadow-2xl transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h3 className="text-3xl font-bold mb-6">
              {isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto"}
            </h3>
            <p className="mb-8 text-base leading-relaxed">{feedback}</p>
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
