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
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [mensajeReinicio, setMensajeReinicio] = useState("");
  const [esperandoFeedback, setEsperandoFeedback] = useState(false);

  const [tokens, setTokens] = useState(0); // Tokens basados en páginas seleccionadas
  const [respuestasUsuario, setRespuestasUsuario] = useState([]);

  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {

    // 🔐 Verificar si hay token de autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
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
    if (selectedOption === null || selectedOption === undefined || enviandoRespuesta) return;

    setEnviandoRespuesta(true);
    setEsperandoFeedback(true);
    setShowModal(true);

    const currentQuestion = questions[currentIndex];
    const opciones = [
      currentQuestion.opcion1,
      currentQuestion.opcion2,
      currentQuestion.opcion3,
      currentQuestion.opcion4
    ];

    let explanation = "";
    let fueCorrecta = false;

    if (selectedOption === currentQuestion.respuesta) {
      setTimeout(() => {
        setFeedback("✅ ¡Correcto!");
        setIsCorrect(true);
        setEsperandoFeedback(false); // Oculta loader
        setShowModal(true); // Mostrar feedback solo cuando ya se procesó todo
      }, 600); // Espera visible de 0.6 segundos
      fueCorrecta = true;
      } else {
        try {
          explanation = await getExplanation(
            currentQuestion.pregunta,
            opciones[currentQuestion.respuesta]
          );
          setTimeout(() => {
            setFeedback(`❌ Incorrecto. ${explanation}`);
            setIsCorrect(false);
            setEsperandoFeedback(false);
          }, 600); // misma espera para mantener consistencia
        } catch (e) {
          setTimeout(() => {
            setFeedback("❌ Incorrecto. (No se pudo obtener la explicación)");
            setIsCorrect(false);
            setEsperandoFeedback(false);
          }, 600); // incluso en error, mostrar tras misma espera
        }
    }


    setRespuestasUsuario(prev => [
      ...prev,
      {
        pregunta: currentQuestion.pregunta,
        opciones,
        correcta: currentQuestion.respuesta,
        seleccionada: selectedOption,
        fueCorrecta
      }
    ]);

    setEnviandoRespuesta(false);
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
    setFeedback("");
    setIsCorrect(null);
    setShowModal(false);
    setRespuestasUsuario([]);
    localStorage.setItem("currentIndex", "0");

    setMensajeReinicio("¡Test reiniciado con éxito!");
    setTimeout(() => setMensajeReinicio(""), 2500);
  };



  if (loading) return <TestSkeletonLoader darkMode={darkMode} />;

  if (!questions.length) {
    return <p className="animate-fadeSlideIn text-center mt-10 text-red-500">❌ No se encontraron preguntas. Volviendo al inicio...</p>;
  }

  if (currentIndex >= questions.length) {
    const total = questions.length;
    const correctas = respuestasUsuario.filter(r => r.fueCorrecta).length;
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
        respuestasUsuario={respuestasUsuario}
        
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
      
      {mensajeReinicio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-8 py-5 rounded-2xl shadow-2xl text-xl font-semibold flex items-center gap-4 animate-popAndFade">
            <span className="text-3xl">🎯</span>
            <span>{mensajeReinicio}</span>
          </div>
        </div>
      )}

      <h2 className="mt-20 text-2xl font-bold mb-2">{`Pregunta ${currentIndex + 1} / ${questions.length}`}</h2>
      

      <PreguntaCard
        pregunta={currentQuestion.pregunta}
        opciones={opciones}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      <button
        onClick={handleSendAnswer}
        disabled={selectedOption === null || enviandoRespuesta}
        className={`mt-6 w-full max-w-xl font-bold py-2 px-4 rounded disabled:opacity-50
          ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
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
            {esperandoFeedback ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-lg font-medium">Evaluando respuesta...</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
