import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function PublicIndex() {
  const router = useRouter();
  const { token } = useAuth();

  const handleStart = () => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <nav className="bg-gray-900 text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-blue-400">MindCheck</h1>
        <button onClick={handleStart} className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">
          {token ? "Ir al Panel" : "Iniciar Sesión"}
        </button>
      </nav>

      <main className="text-center mt-20 px-4">
        <h2 className="text-4xl font-bold mb-4">¡Transforma tus PDFs en tests inteligentes! 📄🤖</h2>
        <p className="text-lg mb-8">MindCheck convierte tus documentos en exámenes interactivos con IA.</p>
        <button
          onClick={handleStart}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl text-lg"
        >
          Comenzar ahora
        </button>

        <div className="mt-16 text-gray-600">
          <h3 className="text-2xl font-semibold">💡 Funcionalidades:</h3>
          <ul className="mt-4 space-y-2">
            <li>✅ Subida de PDFs con texto relevante</li>
            <li>✅ Selección personalizada de páginas</li>
            <li>✅ Generación automática de preguntas</li>
            <li>✅ Sistema de tokens y recompensas</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
