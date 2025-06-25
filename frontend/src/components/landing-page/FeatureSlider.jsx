// components/landing-page/FeatureSlider.jsx

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import FeatureCard from "../common/FeatureCard";


export default function FeatureSlider() {
  const features = [
    {
      iconSrc: "/assets/ic-1upload.svg",
      title: "Carga inteligente de Documento.",
      description: "Sube cualquier documento y olvídate del formateo: lo leemos, lo limpiamos y lo entendemos.",
      background: "bg-[#F1F3F9]",
    },
    {
      iconSrc: "/assets/ic-2select.svg",
      title: "Selección de páginas a la carta.",
      description: "Elige solo los pasajes que importan; tu tiempo vale más que todo el capítulo entero.",
      background: "bg-[#FEE2E2]",
    },
    {
      iconSrc: "/assets/ic-4gen.svg",
      title: "Generación instantánea por IA.",
      description: "Preguntas únicas, alineadas a Bloom, listas en segundos y jamás repetidas.",
      background: "bg-[#0F172A]",
      textColor: "text-white",
    },
        {
      iconSrc: "/assets/ic-3mode.svg",
      title: "Dificultad y cantidad 100 % ajustables.",
      description: "De repaso rápido a prueba final; tú decides la intensidad del desafío y el tiempo que vas a dedicar.",
      background: "bg-[#F1F3F9]",
    },
        {
      iconSrc: "/assets/ic-5feed.svg",
      title: "Feedback con explicación.",
      description: "Cada respuesta incorrecta viene acompañada de la “mini-clase” que necesitas para corregirla.",
      background: "bg-[#445059]",
      textColor: "text-white",
    },
        {
      iconSrc: "/assets/ic-6result.svg",
      title: "Economía de tokens & gamificación.",
      description: "Elige solo los pasajes que importan; tu tiempo vale más que todo el capítulo entero.",
      background: "bg-[#f1bd22]",
    },
  ];

  return (
    <section className="mt-65 py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-6 justify-center items-start">
        <div className="max-w-sm text-left pl-20">
          <h2 className="text-3xl rubik-light-italic mb-2 text-gray-800 mr-20">
            Lo que MindCheck <br />
            <span className="rubik-semibold text-gray-900">te ayuda crear.</span>
          </h2>
          <p className="rubik-light text-[17px] text-gray-600 mt-2">
            Combinamos la mejor tecnología con los métodos de evaluación más utilizados
            para reconfigurar la comprensión y dinamizar el conocimiento.
          </p>
        </div>

        {/* Slider con Swiper */}
        <div className="relative w-full overflow-visible">
            <Swiper
                modules={[Pagination]}
                pagination={{
                el: ".custom-pagination",
                clickable: true,
                }}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 16, 
                    },
                1024: {
                    slidesPerView: 3.5, 
                    spaceBetween: 200,
                    },
                }}
            >
                {features.map((f, i) => (
                <SwiperSlide key={i}>
                    <FeatureCard {...f} />
                </SwiperSlide>
                ))}
            </Swiper>


            {/* Paginación personalizada */}
            <div className="custom-pagination mt-6 flex justify-center gap-2" />
            
            {/* Fade izquierdo */}
            <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

            {/* Fade derecho */}
            <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        </div>
      </div>
    </section>
  );
}