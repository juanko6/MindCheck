import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PreguntaCard from "@/components/PreguntaCard";
import ResultCard from "@/components/ResultCard";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/common/ThemeToggle";
import { getExplanation } from "@/services/api";
import { generateQuestionsFromPdf } from "@/services/api";

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [vidas, setVidas] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    let ejecutado = false;
    const fetchQuestions = async () => {
      if (ejecutado) return;
      ejecutado = true;
      const storedQuestions = localStorage.getItem("questions");
      const storedVidas = localStorage.getItem("vidas");
      const storedIndex = localStorage.getItem("currentIndex");
  
      if (storedQuestions) {
        try {
          const parsed = JSON.parse(storedQuestions);
          if (!parsed.preguntas || parsed.preguntas.length === 0) {
            throw new Error("No se generaron preguntas.");
          }
          setQuestions(parsed.preguntas);
          setVidas(storedVidas ? parseInt(storedVidas) : 5);
          setCurrentIndex(storedIndex ? parseInt(storedIndex) : 0);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error cargando preguntas del localStorage:", error);
          localStorage.removeItem("questions"); // limpiar si está corrupto
        }
      }
  
      // Si no había preguntas guardadas, generarlas desde cero
      const pdfUrl = localStorage.getItem("pdfUrl");
      const paginas = localStorage.getItem("paginasSeleccionadas");
      const numeroPreguntas = localStorage.getItem("numeroPreguntas");
      const nivelDificultad = localStorage.getItem("nivelDificultad");
  
      if (!pdfUrl || !paginas || !numeroPreguntas || !nivelDificultad) {
        alert("Faltan datos del test. Redirigiendo al inicio.");
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

        console.log("🧠 Resultado recibido de la IA:", result);
  
        if (!result.preguntas || result.preguntas.length === 0) {
          throw new Error("No se generaron preguntas.");
        }
  
        localStorage.setItem("questions", JSON.stringify(result));
        localStorage.setItem("vidas", "5");
        localStorage.setItem("currentIndex", "0");
  
        setQuestions(result.preguntas.preguntas);
        setVidas(5);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error generando preguntas:", error);
        alert("No se pudieron generar preguntas. Redirigiendo...");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, []);

  const handleSendAnswer = async () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentIndex];
    if (selectedOption.trim() === currentQuestion.respuesta.trim()) {
      setFeedback("✅ ¡Correcto!");
      setIsCorrect(true);
    } else {
      const explanation = await getExplanation(currentQuestion.pregunta, currentQuestion.respuesta);
      setFeedback(`❌ Incorrecto. ${explanation}`);
      setIsCorrect(false);
      setVidas(prev => {
        const newVidas = prev - 1;
        localStorage.setItem("vidas", newVidas.toString());
        return newVidas;
      });
    }
    setShowModal(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption("");
    setFeedback("");
    setIsCorrect(null);
    setShowModal(false);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      localStorage.setItem("currentIndex", newIndex.toString());
      return newIndex;
    });
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setVidas(5);
    setSelectedOption("");
    localStorage.setItem("vidas", "5");
    localStorage.setItem("currentIndex", "0");
  };

  if (loading) return <p className="text-center mt-10">Cargando preguntas...</p>;

  if (!questions.length) {
    return <p className="text-center mt-10 text-red-500">❌ No se encontraron preguntas. Volviendo al inicio...</p>;
  }

  if (vidas <= 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-red-100 text-red-800"}`}>
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
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
        disabled={!selectedOption}
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
