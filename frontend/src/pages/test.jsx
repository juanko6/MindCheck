import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PreguntaCard from "@/components/test/PreguntaCard";
import ResultCard from "@/components/test/ResultCard";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import { getExplanation } from "@/services/api";
import { generateQuestionsFromPdf } from "@/services/api";


export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [vidas, setVidas] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { darkMode } = useTheme();

  const TestSkeletonLoader = ({ darkMode }) => {
    const shimmerStyle = {
      background: 'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite linear',
    };
  
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <ThemeToggle />
  
        <h2 className="text-2xl font-bold mb-2">Pregunta 1 / 5</h2>
        <p className="text-lg mb-6">Vidas: ❤️❤️❤️❤️❤️</p>
  
        <div className={`p-6 rounded-lg shadow-md w-full max-w-xl transition-colors duration-500 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="w-3/4 h-6 rounded mb-6" style={shimmerStyle}></div>
          <div className="flex flex-col items-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full h-12 rounded-xl"
                style={shimmerStyle}
              ></div>
            ))}
          </div>
        </div>
  
        <div className="flex flex-col gap-4 mt-6 w-full max-w-xl">
          <div className="h-10 rounded bg-blue-400 opacity-60" style={shimmerStyle}></div>
          <div className="h-10 rounded bg-red-400 opacity-60" style={shimmerStyle}></div>
        </div>
      </div>
    );
  };
  

  
  useEffect(() => {
    const fetchData = async () => {
      const stored = localStorage.getItem("questions");
  
      if (stored) {
        const parsed = JSON.parse(stored);
        setQuestions(parsed.preguntas || []);
        setVidas(parseInt(localStorage.getItem("vidas")) || 5);
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
        localStorage.setItem("vidas", "5");
        localStorage.setItem("currentIndex", "0");
  
        setQuestions(result.preguntas);
        setVidas(5);
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
  
    // Solo si fue incorrecta, reducimos vida
    if (!isCorrect) {
      setVidas(prev => {
        const newVidas = prev - 1;
        localStorage.setItem("vidas", newVidas.toString());
        return newVidas;
      });
    }
  
    // Si aún hay preguntas por responder y vidas, avanzamos
    setSelectedOption(null);
    setFeedback("");
    setIsCorrect(null);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      localStorage.setItem("currentIndex", newIndex.toString());
      return newIndex;
    });
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setVidas(5);
    setSelectedOption(null);
    localStorage.setItem("vidas", "5");
    localStorage.setItem("currentIndex", "0");
  };

  if (loading) return <TestSkeletonLoader darkMode={darkMode} />;

  if (!questions.length) {
    return <p className="animate-fadeSlideIn text-center mt-10 text-red-500">❌ No se encontraron preguntas. Volviendo al inicio...</p>;
  }

  if (vidas <= 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-500 ${darkMode ? "animate-fadeSlideIn bg-gray-900 text-white" : "animate-fadeSlideIn bg-red-100 text-red-800"}`}>
        <h1 className="text-5xl font-bold mb-8">💀 GAME OVER 💀</h1>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
          >
            Volver al Inicio
          </button>
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            onClick={handleRetry}
          >
            Volver a Intentarlo
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    const total = questions.length;
    const correctas = total - (5 - vidas);
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
      <ThemeToggle />

      <h2 className="text-2xl font-bold mb-2">{`Pregunta ${currentIndex + 1} / ${questions.length}`}</h2>
      <p className="text-lg mb-6">Vidas: {"❤️".repeat(vidas)}</p>

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
