import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PreguntaCard from "@/components/test/PreguntaCard";
import ResultCard from "@/components/test/ResultCard";
import { useTheme } from "@/context/ThemeContext";
import { getExplanation } from "@/services/api";
import TestSkeletonLoader from "@/components/test/SkeletonLoader";
import { getTestById } from "@/services/testService";
import { useAuth } from "@/context/AuthContext";
import { submitTestResult } from "@/services/testService";
import DashedButton from "@/components/common/DashedButton";


export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [mensajeReinicio, setMensajeReinicio] = useState("");
  const [esperandoFeedback, setEsperandoFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modoSeleccionado, setModoSeleccionado] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { query } = useRouter();
  const [respuestasUsuario, setRespuestasUsuario] = useState([]);

  const router = useRouter();
  const { darkMode } = useTheme();
  const { token, user, loading: authLoading } = useAuth();

  useEffect(() => {
    let isMounted = true; // ← evita ejecución si el componente se desmonta

    const fetchData = async () => {
      if (!token || !user || authLoading) return;

      const { testId } = router.query;
      if (!testId) return;

      try {
        const data = await getTestById(testId, token);  // <-- primero obtén 'data'
        //console.log("Test cargado:", data);

        if (!data.preguntas || data.preguntas.length === 0) {
          throw new Error("Test inválido");
        }

        if (isMounted) {
          //console.log("Preguntas recibidas:", data.preguntas);
          //console.log("📌 Dificultad recibida desde backend:", data.dificultad);
          setModoSeleccionado(data.dificultad || ""); // ← luego accedes a 'data'
          setQuestions(data.preguntas);
          setCurrentIndex(0);

          /* // 👇 Forzar modo resultados durante desarrollo
          if (process.env.NODE_ENV === "development") {
            setCurrentIndex(Number.MAX_SAFE_INTEGER);
          } */
        }
      } catch (e) {
        console.error("Error cargando test:", e);
        alert("Error al cargar el test.");
        router.push("/client/upload");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup para evitar ejecuciones tras desmontar
    };
  }, [token, user, authLoading, router.query]);


  useEffect(() => {
    const testId = new URLSearchParams(window.location.search).get("testId");
    const total = questions.length;
    const correctas = respuestasUsuario.filter((r) => r.fueCorrecta).length;
    const porcentaje = Math.round((correctas / total) * 100);

    // ✅ Solo enviar si se ha terminado el test y hay respuestas
    if (
      testId &&
      total > 0 &&
      respuestasUsuario.length === total &&
      !hasSubmitted
    ) {
      const enviar = async () => {
        try {
          await submitTestResult(testId, respuestasUsuario, porcentaje, token);
          //console.log("✅ Resultado del test guardado");
          setHasSubmitted(true);
        } catch (err) {
          console.error("❌ No se pudo guardar el resultado:", err);
        }
      };

      enviar();
    }
  }, [respuestasUsuario, questions, hasSubmitted]);



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
    setCurrentIndex((prev) => prev + 1);
  };


  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setFeedback("");
    setIsCorrect(null);
    setShowModal(false);
    setRespuestasUsuario([]);

    setMensajeReinicio("¡Test reiniciado con éxito!");
    setTimeout(() => setMensajeReinicio(""), 2500);
  };



  if (loading) return <TestSkeletonLoader darkMode={darkMode} />;

  if (!token || !user) {
    router.push("/login");
    return null;
  }

  if (!questions.length) {
    return <p className="animate-fadeSlideIn text-center mt-10 text-red-500">❌ No se encontraron preguntas. Volviendo al inicio...</p>;
  }

  if (currentIndex >= questions.length) {
    const total = questions.length;
    const correctas = respuestasUsuario.filter(r => r.fueCorrecta).length;
    const porcentaje = Math.round((correctas / total) * 100);
    let mensajeFinal = "";

    if (porcentaje >= 100) mensajeFinal = "¡Nada se te escapa! Podrías enseñarle al profe.";
    else if (porcentaje >= 80) mensajeFinal = "Tus apuntes tiemblan cuando te ven llegar.";
    else if (porcentaje >= 60) mensajeFinal = "¡Casi lo logras! Un repaso más y arrasas.";
    else if (porcentaje >= 40) mensajeFinal = "Estás calentando motores. Sigue así.";
    else mensajeFinal = "Respira… todo gran genio empieza fallando.";

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

    <div className={
      `min-h-screen flex flex-col items-center p-6 transition-colors duration-500 
      ${darkMode ? "animate-fadeSlideIn bg-gray-900 text-white" : "animate-fadeSlideIn bg-gray-100 text-gray-900"}`}
    >
      <div className="flex justify-end items-center w-full max-w-5xl mb-4 gap-4">
        <div
          className={`text-white font-bold text-sm px-4 py-1 rounded-full uppercase shadow-lg tracking-wide
            ${modoSeleccionado === "Modo Relax" ? "bg-green-500" :
              modoSeleccionado === "Modo Café" ? "bg-yellow-600" :
                modoSeleccionado === "Modo Insano" ? "bg-red-600" :
                  modoSeleccionado === "Modo Leyenda" ? "bg-purple-700" : "bg-gray-400"
            }`}
        >
          {modoSeleccionado}
        </div>

        <DashedButton
          bgColor="bg-red-500"
          textColor="text-white"
          withBorder={false}
          className="hover:bg-red-700"
          onClick={() => router.push("/client/upload")}
        >
          ✕
        </DashedButton>

      </div>


      {mensajeReinicio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-8 py-5 rounded-2xl shadow-2xl text-xl font-semibold flex items-center gap-4 animate-popAndFade">
            <span className="text-3xl">🎯</span>
            <span>{mensajeReinicio}</span>
          </div>
        </div>
      )}

      <h2 className="mt-6 text-2xl rubik-semibold mb-2">{`Pregunta ${currentIndex + 1} / ${questions.length}`}</h2>


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
