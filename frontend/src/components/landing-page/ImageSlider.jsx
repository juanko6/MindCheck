// components/landing-page/ImageSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function ImageSlider() {
  const slides = [
    { src: "/slider/1.png", alt: "Estudiar con MindCheck 1" },
    { src: "/slider/2.png", alt: "Estudiar con MindCheck 2" },
    { src: "/slider/3.png", alt: "Estudiar con MindCheck 3" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto my-8">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {slides.map(({ src, alt }) => (
          <SwiperSlide key={src}>
            {/* Contenedor RESPONSABLE de la altura */}
            <div className="relative w-full aspect-[16/9] md:aspect-[3/1]"> 
              <Image
                src={src}
                alt={alt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 900px, 100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
