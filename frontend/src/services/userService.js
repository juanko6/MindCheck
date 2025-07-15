import { API_BASE } from "./config";

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
