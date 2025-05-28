const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/auth";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }

  return res.json(); // { access_token }
}

export async function register(email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Error al registrar");
  }

  return res.json(); // { access_token }
}
