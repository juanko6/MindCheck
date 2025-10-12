// pages/verify-email.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2';
import CircularLoader from "@/components/common/CircularLoader";

export default function VerifyEmailPage() {
  const { 
    verifyEmail,
    resendVerificationCode,
    pendingVerificationEmail
  } = useAuth();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [autoResent, setAutoResent] = useState(false); // ✅ Nuevo estado
  const router = useRouter();

  useEffect(() => {
    const emailToVerify = pendingVerificationEmail || localStorage.getItem("pendingVerificationEmail");
    
    if (emailToVerify) {
      setEmail(emailToVerify);
      
      // ✅ SI VIENE DESDE LOGIN (código expirado), reenviar automáticamente
      if (!autoResent && localStorage.getItem("needsNewCode") === "true") {
        handleAutoResend(emailToVerify);
        localStorage.removeItem("needsNewCode");
        setAutoResent(true);
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "No hay cuenta pendiente",
        text: "Por favor regístrate primero",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/register");
    }
  }, [pendingVerificationEmail, router, autoResent]);

  // ✅ Función para reenviar automáticamente cuando viene desde login
  const handleAutoResend = async (emailAddress) => {
    try {
      await resendVerificationCode(emailAddress);
      
      Swal.fire({
        icon: "info",
        title: "Código expirado",
        text: "Tu código anterior expiró. Te hemos enviado uno nuevo.",
        timer: 3000,
        showConfirmButton: true,
      });
    } catch (err) {
      console.error("Error reenviando automáticamente:", err);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el código. Intenta con 'Reenviar código'.",
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: "El código debe tener 6 dígitos",
      });
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: "El código debe contener solo números",
      });
      return;
    }

    setLoading(true);

    try {
      await verifyEmail(email, code);
      
      setLoading(false);
      
      Swal.fire({
        icon: "success",
        title: "¡Cuenta verificada!",
        text: "Tu cuenta ha sido activada exitosamente",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/dashboard");
      });
      
    } catch (err) {
      setLoading(false);
      console.error("Error verificando:", err);
      
      let errorMessage = "Código inválido o expirado";
      
      if (err.message.includes("expirado")) {
        errorMessage = "El código ha expirado. Solicita uno nuevo";
      } else if (err.message.includes("inválido")) {
        errorMessage = "Código incorrecto. Verifica e intenta nuevamente";
      } else if (err.message.includes("verificada")) {
        errorMessage = "Esta cuenta ya está verificada. Puedes iniciar sesión";
      }
      
      Swal.fire({
        icon: "error",
        title: "Error de verificación",
        text: errorMessage,
      });
    }
  };

  const handleResend = async () => {
    setResending(true);
    
    try {
      await resendVerificationCode(email);
      
      setResending(false);
      setCode("");
      
      Swal.fire({
        icon: "success",
        title: "Código reenviado",
        text: "Revisa tu correo nuevamente. El código anterior ya no es válido.",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      setResending(false);
      console.error("Error reenviando:", err);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo reenviar el código",
      });
    }
  };

  return (
    <>
      {(loading || resending) && <CircularLoader />}
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Verifica tu Email
            </h2>
            <p className="text-gray-700 font-medium">
              Hemos enviado un código de 6 dígitos a:
            </p>
            <p className="font-semibold text-purple-600 mt-2 text-lg break-all">
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-center text-gray-800">
                Código de Verificación
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                placeholder="000000"
                autoFocus
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-600 font-medium mt-2 text-center">
                ⏱️ El código expira en 15 minutos
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base shadow-md hover:shadow-lg"
            >
              {loading ? "Verificando..." : "Verificar Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 font-medium mb-2">
              ¿No recibiste el código?
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-purple-600 hover:text-purple-700 hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {resending ? "Reenviando..." : "Reenviar código"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium hover:underline transition"
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
