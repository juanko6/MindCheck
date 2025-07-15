import { API_BASE } from "./config"

const API_URL = `${API_BASE}auth`;

export async function login(identifier, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  return res.json(); // { access_token }
}


export async function register(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error al registrar");
  }

  return res.json();
}

