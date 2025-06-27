// components/dashboard/Layout.jsx

import { useTheme } from "@/context/ThemeContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-[#f4f4f5] text-gray-900 dark:bg-[#111827] dark:text-white transition-colors duration-300">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <Topbar />
          <main className="p-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
