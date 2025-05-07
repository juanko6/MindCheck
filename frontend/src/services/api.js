// services/api.js
import axios from "axios";

/**
 * Sube un archivo PDF al backend para generar preguntas.
 * @param {File} file - Archivo PDF seleccionado por el usuario.
 * @param {number} numeroPreguntas - Número de preguntas a generar.
 * @param {string} nivelDificultad - Nivel de dificultad seleccionado.
 * @param {function} onProgress - Callback para monitorear el progreso de subida.
 * @returns {Promise<Object>} - Respuesta del backend con las preguntas generadas.
 */
export const uploadPDF = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);


  const response = await axios.post("http://localhost:8000/upload-pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onProgress,
  });

  return response.data;
};

/**
 * Solicita una explicación a la IA sobre por qué una respuesta es correcta.
 * @param {string} pregunta - Pregunta respondida incorrectamente.
 * @param {string} respuestaCorrecta - Respuesta correcta.
 * @returns {Promise<string>} - Explicación generada por la IA.
 */
export const getExplanation = async (pregunta, respuestaCorrecta) => {
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

export const generateQuestionsFromPdf = async (pdfUrl, paginas, numeroPreguntas, nivelDificultad) => {
    const response = await axios.post("http://localhost:8000/generate-questions", {
      pdfUrl,
      paginas,
      numeroPreguntas,
      nivelDificultad
    });
    return response.data;
  };
  