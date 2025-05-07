import { useTheme } from "@/context/ThemeContext";

export default function PreguntaCard({ pregunta, opciones, selectedOption, setSelectedOption }) {
  const { darkMode } = useTheme();

  return (
    <div className={`p-6 rounded-lg shadow-md w-full max-w-xl transition-colors duration-500
      ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>

      <p className={`text-lg font-semibold mb-6 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
        {pregunta}
      </p>

      <div className="flex flex-col items-center gap-4">
        {opciones.map((opcion, index) => {
          const isSelected = selectedOption === index;
          const isAnswered = !!selectedOption !== null;
          const isDisabled = isAnswered && !isSelected; // ✅ Solo deshabilita si ya se respondió

          return (
            <label
              key={index}
              className={`w-full flex justify-center items-center p-4 rounded-xl cursor-pointer font-semibold border-2 transition-all duration-300
                ${isSelected 
                  ? "bg-blue-600 text-white border-blue-700 scale-105"
                  : darkMode
                    ? `border-gray-600 ${isDisabled ? "text-gray-400" : "text-gray-200"} hover:border-blue-400 hover:bg-gray-700 hover:text-white`
                    : `border-gray-400 ${isDisabled ? "text-gray-400" : "text-gray-800"} hover:border-blue-400 hover:bg-gray-100 hover:text-blue-900`
                }`}
            >
              <input
                type="radio"
                name="option"
                value={opcion}
                checked={isSelected}
                onChange={(e) => setSelectedOption(index)}
                className="hidden"
              />
              <span className="text-center">
                {opcion}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
