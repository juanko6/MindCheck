// components/common/DashedCardOption.jsx
// se utiliza para las opciones de subir el documento

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function DashedCardOption({ icon, text, onClick }) {
    
    const { darkMode } = useTheme();


  return (
    <div
      onClick={onClick}
      className={`relative border-[5px] border-gray-400 border-dashed rounded-xl p-6
                 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition hover:bg-gray-200 ${darkMode ? "bg-[#0B1120] hover:bg-gray-600" : "bg-gray-300 text-gray-900"}`}
    >
      {/* Logo MindCheck en la esquina superior derecha */}
      <div className="absolute -top-6 -right-6">
        <Image
          src="/assets/dashboard/ic-mc-round.svg" // ajusta según tu path real
          alt="MindCheck"
          width={45}
          height={50}
        />
      </div>

      {/* Ícono central */}
      <Image src={icon} alt="Icono" width={50} height={50} />
      <p className="mt-4 text-lg rubik-regular text-center">{text}</p>
    </div>
  );
}
