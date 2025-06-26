// components/landing-page/StepByStep.jsx

import { useState } from "react";
import { useRouter } from "next/router";
import DashedButton from "../common/DashedButton";
import CardStep from "../common/CardStep";

export default function StepByStep() {

    const [open, setOpen] = useState(false);
    const router = useRouter();

    const go = (path) => {
        router.push(path);
        setOpen(false);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-15 flex flex-col md:flex-row gap-6 items-start">
                {/* Texto izquierdo */}
                <div className="max-w-sm text-left ">
                    <h2 className="text-3xl rubik-light-italic mb-2 text-gray-800">
                    Cómo
                    <span className="rubik-semibold text-gray-900"> generar </span>
                    un test con MindCheck.
                    </h2>
                    <p className="rubik-light text-[17px] text-gray-600 mt-2 pb-3">
                    En cuatro simples pasos podras empezar a entrenar con tus apuntes.
                    </p>

                    <DashedButton
                    className="hover:bg-yellow-300 w-full"
                    onClick={() => go("/login")}
                    >
                        Empecemos
                    </DashedButton>
                </div>
            </div>

            {/* Cards de pasos dentro del mismo contenedor */}
            <div className="max-w-6xl mx-auto px-4 mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

                    <CardStep
                        title={<><span className="rubik-light-italic">Sube tu</span> <span className="rubik-semibold">documento.</span></>}
                        icon="/assets/upload.svg"
                        iconSize="w-[100px] h-[100px]"
                        description="Por el momento en .pdf, pueden ser tus apuntes o las presentaciones."
                    />

                    <CardStep
                        title={<><span className="rubik-light-italic">Marca las paginas</span> <span className="rubik-semibold">clave.</span></>}
                        icon="/assets/checkpage.svg"
                        iconSize="w-[100px] h-[100px]"
                        bgImage="/assets/mindcheck-watermark.svg"
                        description="Selecciona de tu PDF las páginas que quieres tener en cuenta para el test."
                    />
                    <CardStep
                        title={<><span className="rubik-light-italic">Define</span> <span className="rubik-semibold">modo</span> <span className="rubik-light-italic">dificultad.</span></>}
                        icon="/assets/brain-mode.svg"
                        iconSize="w-[100px] h-[100px]"
                        description="Diferentes opciones para tu aprendizaje, desde test rápido hasta entrenamiento profundo."
                    />
                    <CardStep
                        title={<><span className="rubik-light-italic">Responde y </span> <span className="rubik-semibold">mejora.</span></>}
                        icon="/assets/super-mind.svg"
                        iconSize="w-[100px] h-[100px]"
                        bgImage="/assets/mindcheck-watermark.svg"
                        description="Un test moderno y con feedback automático para que te aclares."
                    />
                </div>
            </div>
            <div className="text-[40px] mt-10 text-center px-4">
                <span className="rubik-light-italic">Todo en </span> 
                <span className="rubik-semibold">menos de un minuto.</span>
            </div>
        </section>
    );
}