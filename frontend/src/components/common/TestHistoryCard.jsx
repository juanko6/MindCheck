// components/common/TestHistoryCard.jsx

import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/router";
import DashedButton from "./DashedButton";

export default function TestHistoryCard({ test }) {
  const router = useRouter();
  const { darkMode } = useTheme();

  return (
    <div className={`border-[5px] border-gray-400 border-dashed rounded-xl p-4 
        hover:shadow-lg ${darkMode ? "bg-[#0B1120]" : "bg-gray-300 text-gray-900"}`}
    >
      <p className="rubik-semibold mb-1">Título Material:</p>
      <p className="text-sm mb-2 rubik-regular truncate">{test.title}</p>
      <p className="text-sm mb-4 rubik-regular">
        Fecha: {new Date(test.created_at).toLocaleDateString()}
      </p>
      <DashedButton
        fullWidth={true}
        className="hover:bg-yellow-300 w-full"
        onClick={() => router.push(`/client/test?testId=${test.id}`)}
      >
        Repetir
      </DashedButton>
    </div>
  );
}
