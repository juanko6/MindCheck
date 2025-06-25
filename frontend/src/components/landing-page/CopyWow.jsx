import StripeWow from '@/components/common/StripeWow';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function CopyWow() {
  const frases = [
    <>
      <span className="rubik-semibold">Imagina</span>{' '}
      <span className="rubik-light-italic">
        dominar tu próximo examen sin maratones nocturnas.
      </span>
    </>,
    <>
      <span className="rubik-semibold">Imagina</span>{' '}
      <span className="rubik-light-italic">
        que aprender vuelva a ser divertido.
      </span>
    </>,
    <>
      <span className="rubik-semibold">Eso es</span>{' '}
      <span className="rubik-light-italic">MindCheck.</span>
    </>,
  ];

  return (
    <StripeWow
      color="#0E1A2B"
      bgImage="/assets/mindcheck-watermark.svg"
      bgOpacity={0.07}
      bgWidth="1000px"
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full max-w-4xl h-[140px]"
      >
        {frases.map((frase, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center w-full h-full">
            <h2 className="text-white text-center text-3xl md:text-5xl leading-tight px-4">
              {frase}
            </h2>
          </SwiperSlide>
        ))}
      </Swiper>
    </StripeWow>
  );
}
