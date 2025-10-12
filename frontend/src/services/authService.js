import { API_BASE } from "./config"

const API_URL = `${API_BASE}/auth`;

export async function register(email, password) {
  const payload = { email, password };
  //console.log('📤 Registrando usuario:', { email, password: '***' });
  
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('❌ Error registro:', error);
    throw new Error(error.detail || "Error al registrar");
  }

  const data = await res.json();
  //console.log('✅ Registro exitoso:', data);
  return data; // { message, email }
}

export async function verifyEmail(email, code) {
  const payload = { email, code };
  //console.log('📤 Verificando email:', payload);
  
  const res = await fetch(`${API_URL}/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  //console.log('📥 Status:', res.status);

  if (!res.ok) {
    const error = await res.json();
    console.error('❌ Error verificación:', error);
    throw new Error(error.detail || "Error al verificar");
  }

  const data = await res.json();
  //console.log('✅ Verificación exitosa:', data);
  return data; // { access_token, token_type }
}

export async function resendCode(email) {
  const payload = { email };
  //console.log('📤 Reenviando código a:', email);
  
  const res = await fetch(`${API_URL}/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('❌ Error reenvío:', error);
    throw new Error(error.detail || "Error al reenviar código");
  }

  const data = await res.json();
  //console.log('✅ Código reenviado');
  return data; // { message }
}

export async function login(identifier, password) {
  const payload = { identifier, password };
  //console.log('📤 Login:', { identifier, password: '***' });
  
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('❌ Error login:', error);
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  const data = await res.json();
  //console.log('✅ Login exitoso');
  return data; // { access_token, token_type }
}
