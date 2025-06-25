// components/common/PromoBanner.jsx

import { useState } from "react";
import { useRouter } from "next/router";
import DashedButton from "./DashedButton";

export default function PromoBanner({
  tokens = "300",
  deadline = "Domingo"
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (path) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <section className="w-full flex justify-center px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl bg-gray-100 rounded-lg shadow-sm px-6 py-8 gap-6">
        
        {/* Bloque Izquierdo */}
        <div className="md:pl-25 flex flex-col items-center md:items-start gap-4">
          {/* Recuadro punteado con imagen */}
            <div className="border-[5px] border-dashed border-gray-400 rounded-xl bg-gray-50 px-2 pt-1 pb-0 max-w-[200px]">
            <div className="flex items-center justify-between gap-x-1">
                {/* Izquierda: texto 300 tokens */}
                <div className="leading-none pl-0">
                <p className="text-[53px] rubik-semibold text-gray-900 leading-[0.7] mb-1 mt-2">{tokens}</p>
                <p className="text-[30px] rubik-semibold text-gray-800 mt-0 mb-0">tokens</p>
                </div>
                {/* Derecha: imagen */}
                <img
                src="/assets/token-bag.svg"
                alt="token bag"
                className="w-[65px] h-[75px] -mt-1"
                />
            </div>

            {/* Línea inferior: de bienvenida */}
            <p className="text-[25px] text-center rubik-light-italic text-gray-900 mt-0 mb-2 leading-none">
                de <span className="rubik-semibold">bienvenida</span>
            </p>
            </div>

            {/* Botón debajo del recuadro */}
            <div className="w-[200px]">
                <DashedButton
                    fullWidth={true}
                    textColor="text-gray-800"
                    className="hover:bg-yellow-300 w-full"
                    onClick={() => go("/login")}
                >
                    Quiero mis tokens
                </DashedButton>
            </div>
        </div>

        {/* Bloque Derecho */}
        <div className="text-2xl md:pl-10 text-center md:text-left flex-1">
          <p className="md:text-4xl rubik-light-italic text-gray-900">
            Crea tu cuenta gratis antes <br />
            del {deadline} y activa{" "}
            <span className="rubik-semibold">tu regalo.</span>
          </p>
          <p className="text-xs mt-2 text-gray-500 rubik-light">
            *Promoción limitada, se reinicia cada mes solo para nuevos usuarios.
          </p>
        </div>
      </div>
    </section>
  );
}
