
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`text-sm font-semibold py-1.5 px-4 rounded transition-colors duration-300 hover:scale-105
        ${darkMode
          ? "bg-yellow-400 hover:bg-yellow-500 text-black"
          : "bg-purple-600 hover:bg-purple-800 text-white"
        }`}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
