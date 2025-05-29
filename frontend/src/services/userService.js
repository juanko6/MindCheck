const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Obtiene la información del usuario autenticado.
 * @param {string} token - JWT
 */
export async function fetchUserData(token) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo cargar el usuario");
  return res.json(); // { id, email, role, tokens }
}
