const API = process.env.NEXT_PUBLIC_API_URL + "/tests";

export async function saveTest(token, title, data) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, data }),
  });

  if (!res.ok) throw new Error("Error al guardar el test");
  return res.json();
}


/**
 * Genera un test completo desde el backend a partir del PDF.
 * @param {Object} datos - { pdf_url, paginas, numero_preguntas, dificultad }
 * @param {string} token - Token JWT
 */
export async function generateTest(datos, token) {
  const res = await fetch(`${API}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw new Error("Error al generar el test");
  return res.json(); // { testId: 123 }
}

/**
 * Obtiene un test por su ID.
 */
export async function getTestById(testId, token) {
  const res = await fetch(`${API}/${testId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo cargar el test");
  return res.json(); // { preguntas: [...] }
}

export async function fetchUserTests(token) {
  const res = await fetch(`${API}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("No se pudieron cargar los tests");
  return res.json(); // Array de tests
}

export async function submitTestResult(testId, respuestas, porcentaje, token) {
  const res = await fetch(`${API}/${testId}/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ respuestas, porcentaje }),
  });

  if (!res.ok) throw new Error("Error al enviar resultado");
  return res.json();
}

export async function fetchTestHistory(token) {
  const res = await fetch(`${API}/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Status:", res.status);
    const errorText = await res.text();
    console.error("Response:", errorText);
    throw new Error("No se pudo cargar el historial de tests");
  }

  return res.json();
}

