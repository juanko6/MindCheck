import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PreguntaCard from "@/components/PreguntaCard";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [vidas, setVidas] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loading
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    const storedVidas = localStorage.getItem("vidas");
    const storedIndex = localStorage.getItem("currentIndex");

    if (storedQuestions) {
      try {
        const parsed = JSON.parse(storedQuestions);

        if (!parsed.preguntas || parsed.preguntas.length === 0) {
          console.error("❌ No se generaron preguntas. Volviendo al inicio.");
          localStorage.removeItem("questions");
          router.push("/");
          return;
        }

        setQuestions(parsed.preguntas);
        setVidas(storedVidas ? parseInt(storedVidas) : 5);
        setCurrentIndex(storedIndex ? parseInt(storedIndex) : 0);
      } catch (error) {
        console.error("Error parsing questions:", error);
        localStorage.removeItem("questions");
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
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

  const getExplanation = async (pregunta, respuestaCorrecta) => {
    try {
      const response = await axios.post("http://localhost:8000/explain", {
        question: pregunta,
        correctAnswer: respuestaCorrecta,
      });
      return response.data.explanation || "La respuesta correcta era otra.";
    } catch (error) {
      console.error("Error obteniendo explicación:", error);
      return "La respuesta correcta era otra.";
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando preguntas...</p>; // ✅ nuevo control
  }

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
              localStorage.removeItem("questions");
              localStorage.removeItem("vidas");
              localStorage.removeItem("currentIndex");
              router.push("/");
            }}
          >
            Volver al Inicio
          </button>

          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            onClick={() => {
              setVidas(5);
              setCurrentIndex(0);
              setSelectedOption("");
              localStorage.setItem("vidas", "5");
              localStorage.setItem("currentIndex", "0");
            }}
          >
            Volver a Intentarlo
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    const totalPreguntas = questions.length;
    const respuestasCorrectas = totalPreguntas - (5 - vidas);
    const porcentaje = Math.round((respuestasCorrectas / totalPreguntas) * 100);

    let mensajeFinal = "";
    if (porcentaje >= 90) mensajeFinal = "🧠 ¡Eres un Genio Total!";
    else if (porcentaje >= 70) mensajeFinal = "🔥 ¡Muy bien, casi perfecto!";
    else if (porcentaje >= 50) mensajeFinal = "🤓 ¡Vas bien, sigue practicando!";
    else mensajeFinal = "🤡 ¡Ups! A estudiar se dijo...";

    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-green-100 text-gray-900"}`}>
        <h1 className="text-4xl font-bold mb-6">🎉 ¡Test completado!</h1>

        <div className={`p-6 rounded-lg shadow-lg text-center mb-8 w-full max-w-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <h2 className="text-2xl font-bold mb-4">Resultados</h2>
          <p className="text-lg">Correctas: {respuestasCorrectas} / {totalPreguntas}</p>
          <p className="text-lg">Porcentaje: {porcentaje}%</p>
          <p className="text-2xl mt-4">{mensajeFinal}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div
            onClick={() => {
              localStorage.removeItem("questions");
              localStorage.removeItem("vidas");
              localStorage.removeItem("currentIndex");
              router.push("/");
            }}
            className="p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center font-semibold text-2xl cursor-pointer transition-all duration-300 hover:scale-105"
          >
            🚀 Nuevo Test
            <p className="text-base mt-2 font-normal">Sube otro PDF y empieza de nuevo.</p>
          </div>

          <div
            onClick={() => {
              setCurrentIndex(0);
              setVidas(5);
              setSelectedOption("");
              localStorage.setItem("vidas", "5");
              localStorage.setItem("currentIndex", "0");
            }}
            className="p-8 bg-green-500 hover:bg-green-600 text-white rounded-lg text-center font-semibold text-2xl cursor-pointer transition-all duration-300 hover:scale-105"
          >
            🔄 Repetir Test
            <p className="text-base mt-2 font-normal">Usa las mismas preguntas otra vez.</p>
          </div>
        </div>
      </div>
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
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 font-bold py-2 px-4 rounded transition-colors duration-300 transform hover:scale-105
          ${darkMode ? "bg-yellow-400 hover:bg-yellow-500 text-black" : "bg-purple-600 hover:bg-purple-800 text-white"}`}
      >
        {darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
      </button>

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
          localStorage.removeItem("questions");
          localStorage.removeItem("vidas");
          localStorage.removeItem("currentIndex");
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
