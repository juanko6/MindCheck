// components/common/DocumentCard.jsx

import { useTheme } from "@/context/ThemeContext";
import DashedButton from "./DashedButton";

export default function DocumentCard({ doc, onView, onDelete }) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`border-[5px] border-gray-400 border-dashed rounded-xl p-4 
        hover:shadow-lg ${darkMode ? "bg-[#0B1120]" : "bg-gray-300 text-gray-900"}`}
    >
      <p className="rubik-semibold mb-1">Archivo:</p>
      <p className="text-sm mb-2 rubik-regular truncate">{doc.filename}</p>

      <p className="text-sm mb-4 rubik-regular">
        Fecha: {new Date(doc.uploaded_at).toLocaleDateString()}
      </p>

      <div className="flex flex-col gap-2">
        <DashedButton
          bgColor="bg-yellow-500"
          fullWidth={true}
          withBorder={false}
          className="hover:bg-yellow-300 w-full"
          onClick={() => onView(doc)}
        >
          Ver
        </DashedButton>

        <DashedButton
          bgColor="bg-red-800"
          fullWidth={true}
          withBorder={false}
          className="hover:bg-red-500 w-full"
          onClick={() => onDelete(doc.id)}
        >
          Eliminar
        </DashedButton>
      </div>
    </div>
  );
}
