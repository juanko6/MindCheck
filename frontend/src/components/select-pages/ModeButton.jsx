// components/select-pages/ModeButton.jsx
import React from "react";
import Image from "next/image";

export default function ModeButton({ selected, onClick, imageSrc, label, questions }) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center px-4 py-3 cursor-pointer rounded-lg border-4 transition duration-300 w-[150px] ${
        selected ? "bg-gray-400 border-dashed border-gray-600" : "border-dashed border-gray-400"
      } hover:border-green-500 hover:bg-green-100`}
    >
      <div className="w-20 h-20 mb-2 relative">
        <Image
          src={imageSrc}
          alt={label}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <p className="rubik-semibold text-center text-sm">{label}</p>
      <p className="rubik-semibold text-xs">{questions} preguntas</p>
    </div>
  );
}
