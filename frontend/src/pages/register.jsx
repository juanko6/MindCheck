import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link"
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const allowedDomains = ["gcloud.ua.es", "uceva.edu.co"];

  
  function isInstitutionalEmail(email) {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isInstitutionalEmail(email)) {
      setError("Debes usar un correo institucional válido.");
      return;
    }
    try {
      await register({
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Cuenta creada correctamente",
        text: "Ya puedes empezar a usar MindCheck",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      const errorMessage =
        err?.response?.data?.detail || "Ocurrió un error inesperado.";

      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: errorMessage,
      });
      setError(errorMessage);
    }
  };


  return (
    <div className="min-h-screen bg-[#F1F3F9] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl rounded-2xl overflow-hidden shadow-lg bg-white">
        {/* Logo */}
        <Link href="/" className="w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-[#BDC6D3] flex items-center justify-center p-8 md:p-12 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          <div className="w-40 md:w-60 cursor-pointer">
            <Image
              src="/assets/logo-mindcheck.png"
              alt="MindCheck Logo"
              layout="responsive"
              width={220}
              height={220}
              priority
            />
          </div>
        </Link>

        {/* Formulario de registro */}
        <div className="w-full md:w-2/3 bg-[#909DB1] p-6 md:p-10 flex flex-col justify-center rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">
            Crear Cuenta
          </h2>

          {error && (
            <p className="bg-red-500 text-white text-center p-2 rounded mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de Usuario"
              className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo Institucional"
              className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 rounded border-2 border-dashed border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold border border-green-700 shadow-sm transition"
            >
              Registrarse
            </button>
          </form>

          <button
            onClick={() => alert("Registro con Google aún no implementado")}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#D0D5DC] hover:bg-gray-300 text-black py-3 px-4 rounded shadow-sm"
          >
            <Image src="/assets/google-icon.png" alt="Google" width={20} height={20} />
            Inicia sesión con Google
          </button>

          <p className="mt-4 text-center text-sm text-black">
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-green-600 hover:underline cursor-pointer"
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
