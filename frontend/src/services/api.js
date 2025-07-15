// services/api.js
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL + "/testController";
console.log("API URL usada:", API_BASE);
/**
 * Sube un archivo PDF al backend para generar preguntas.
 * @param {File} file - Archivo PDF seleccionado por el usuario.
 * @param {function} onProgress - Callback para monitorear el progreso de subida.
 * @returns {Promise<Object>} - Respuesta del backend con las preguntas generadas.
 */
export const uploadPDF = async (file, token, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
    formData,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: onProgress,
    }
  );

  const { fileUrl, path  } = response.data;
  console.log("✅ fileUrl recibido:", fileUrl); // <-- Añade esto para verificar
  console.log("🛣️ path recibido:", path);

  return { fileUrl, path }; // ✅ ahora sí retornamos el valor esperado
};

/**
 * Solicita una explicación a la IA sobre por qué una respuesta es correcta.
 * @param {string} pregunta - Pregunta respondida incorrectamente.
 * @param {string} respuestaCorrecta - Respuesta correcta.
 * @returns {Promise<string>} - Explicación generada por la IA.
 */
export const getExplanation = async (pregunta, respuestaCorrecta) => {
  try {
    const response = await axios.post(`${API_BASE}/explain`, {
      question: pregunta,
      correctAnswer: respuestaCorrecta,
    });
    return response.data.explanation || "La respuesta correcta era otra.";
  } catch (error) {
    console.error("Error obteniendo explicación:", error);
    return "La respuesta correcta era otra.";
  }
};

/**
 * Genera preguntas a partir de un PDF con parámetros seleccionados.
 * @param {string} pdfUrl - URL o ruta del PDF.
 * @param {Array<number>} paginas - Páginas seleccionadas.
 * @param {number} numeroPreguntas - Número de preguntas a generar.
 * @param {string} nivelDificultad - Nivel de dificultad.
 * @returns {Promise<Object>} - Preguntas generadas.
 */
export const generateQuestionsFromPdf = async (pdfUrl, paginas, numeroPreguntas, nivelDificultad) => {
  // Extrae solo el nombre del archivo de la URL
  const filename = decodeURIComponent(pdfUrl.split("/").pop());

  const response = await axios.post(`${API_BASE}/generate-questions`, {
    pdfUrl: filename,  // 👈 solo el nombre, no la ruta completa
    paginas,
    numeroPreguntas,
    nivelDificultad,
  });

  let data = response.data;

  if (data?.preguntas?.preguntas) {
    data = { preguntas: data.preguntas.preguntas };
  }

  return data;
};

