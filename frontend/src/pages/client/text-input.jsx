import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { generateTestFromText } from "@/services/testService";
import ModeButton from '@/components/select-pages/ModeButton';
import PageSelectionFooter from '@/components/select-pages/PageSelectionFooter';
import SkeletonLoader from '@/components/test/SkeletonLoader';


// Variables configurables para costo
const PALABRAS_POR_BLOQUE = Number(process.env.NEXT_PUBLIC_PALABRAS_POR_BLOQUE) || 400;
const TOKENS_POR_BLOQUE = Number(process.env.NEXT_PUBLIC_TOKENS_POR_BLOQUE) || 10;


export default function TextInputStep() {
    const router = useRouter();
    const { darkMode } = useTheme();
    const { token, user, loading } = useAuth();

    const [inputText, setInputText] = useState('');
    const [nivelDificultad, setNivelDificultad] = useState("Modo Relax");
    const [tituloTest, setTituloTest] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const modos = [
        { label: "Modo Relax", image: "/assets/dashboard/modo-relax.svg", preguntas: 7 },
        { label: "Modo Café", image: "/assets/dashboard/modo-cafe.svg", preguntas: 15 },
        { label: "Modo Insano", image: "/assets/dashboard/modo-insano.svg", preguntas: 21 },
        { label: "Modo Leyenda", image: "/assets/dashboard/modo-leyenda.svg", preguntas: 25 },
    ];

    // Cálculo de palabras y costo
    const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
    const bloques = Math.ceil(wordCount / PALABRAS_POR_BLOQUE);
    const costo = wordCount === 0 ? 0 : bloques * TOKENS_POR_BLOQUE;

    const handleContinuar = async () => {

        if (isGenerating) return;


        setError('');
        if (!inputText.trim()) {
            setError("Pega tus apuntes antes de continuar.");
            return;
        }

        // ✅ Validar título
        if (!tituloTest.trim()) {
            setError("Ingresa un título para tu test.");
            return;
        }

        if (!user || user.tokens < costo) {
            setError(`No tienes suficientes tokens. Necesitas ${costo}, pero tienes ${user?.tokens || 0}.`);
            return;
        }

        const preguntasPorModo = modos.find(m => m.label === nivelDificultad)?.preguntas || 7;

        setIsGenerating(true); // ✅ Activar loading

        try {
            const response = await generateTestFromText({
                texto: inputText,
                numero_preguntas: preguntasPorModo,
                dificultad: nivelDificultad,
                titulo_test: tituloTest,
            }, token);

            const testId = response.testId;
            router.push(`/client/test?testId=${testId}`);
        } catch (err) {
            setError("Ocurrió un error al generar el test. Intenta nuevamente.");
            console.error("Error generando test:", err);
            setIsGenerating(false);
        }
    };


    const handleToBack = () => {
        router.back();
    };

    if (loading || !token || !user) {
        return <div className="text-white text-center mt-10">Cargando...</div>;
    }

    // ✅ Mostrar SkeletonLoader mientras se genera el test
    if (isGenerating) {
        return <SkeletonLoader />;
    }

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

            <div className="mb-8 w-full max-w-4xl">
                <h3 className="text-xl rubik-semibold mb-4 text-left">Genera tu test desde tus apuntes</h3>
                <h3 className="text-md rubik-regular mb-4 text-left -mt-3">
                    Pega el texto y elige la dificultad. Nosotros hacemos la magia.
                </h3>
                <div className="grid grid-cols-2 gap-4 md:flex justify-items-center md:justify-left md:gap-3 md:pt-6 md:flex-wrap">
                    {modos.map((modo) => (
                        <ModeButton
                            key={modo.label}
                            label={modo.label}
                            imageSrc={modo.image}
                            questions={modo.preguntas}
                            selected={nivelDificultad === modo.label}
                            onClick={() => setNivelDificultad(modo.label)}
                        />
                    ))}
                </div>
            </div>

            <input
                type="text"
                className="w-full max-w-2xl p-4 mb-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Título de tu test (ej: Matemáticas Capítulo 3)"
                value={tituloTest}
                onChange={e => setTituloTest(e.target.value)}
                maxLength={100}
            />

            <textarea
                className="w-full max-w-2xl min-h-[200px] p-4 rounded-xl border-2 border-dashed focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Pega aquí tus apuntes, resumen o presentación..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
            />

            {/* Mostrar el contador de palabras y el costo dinámicamente */}
            <div className="w-full max-w-2xl flex flex-row justify-between mt-2 text-sm text-gray-500">
                <span>Palabras: {wordCount}</span>
                <span>Costo: {costo} tokens</span>
            </div>

            {error && <div className="text-red-500 my-3">{error}</div>}

            <PageSelectionFooter
                onCancel={handleToBack}
                onContinue={handleContinuar}
                disabled={isGenerating} // ✅ Deshabilitar botón mientras carga
            />

        </div>
    );
}
