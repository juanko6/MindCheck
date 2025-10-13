import { API_BASE } from "./config";

/**
 * Obtiene la información del usuario autenticado.
 * @param {string} token - JWT
 */
export async function fetchUserData(token) {
  if (!token) {
    throw new Error("No hay token de autenticación");
  }
  
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // ✅ Lanzar error específico para 401/403
  if (res.status === 401 || res.status === 403) {
    throw new Error("401");
  }

  if (!res.ok) throw new Error("No se pudo cargar el usuario");
  return res.json();
}