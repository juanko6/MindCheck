// components/landing-page/Hero.jsx
import { useState } from "react";
import DashedButton from "../common/DashedButton";
import { useRouter } from "next/router";


export default function Hero({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (path) => {
    router.push(path);
    setOpen(false);        // cierra el menú móvil al navegar
  };

  return (
    <section className="relative mt-13 bg-[#F2F2F2] text-center px-6 pt-16 pb-44">
      <h2 className="text-3xl md:text-5xl rubik-light-italic">
        Estudiar es duro… <span className="rubik-light-italic">hasta que</span> <br />
        usas <span className="rubik-semibold text-gray-900"> MindCheck.</span>
      </h2>

      <p className="mt-4 max-w-xl mx-auto text-[18px] md:text-[23px] text-gray-800 rubik-italic">
        Transformamos apuntes en retos mentales hechos a tu medida. Y sí, es tan genial como suena.
      </p>

      <div className="mt-6">
            <DashedButton
                textColor="text-gray-800"
                className="hover:bg-yellow-300"
                onClick={() => go("/login")}
            >
                Tus apuntes están listos. ¿Lo estás tú?
            </DashedButton>
        
      </div>

    {/* --------- Slider “encajado” --------- */}
    {children && (
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2/3 w-full max-w-5xl">
      {children}
      </div>
    )}

    </section>
  );
}
