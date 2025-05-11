import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("userTokens");
    setTokens(parseInt(stored) || 0);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline">
          MindCheck
        </Link>

        {/* Tokens + Switch */}
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-800 dark:text-white">
            💰 Tokens: <span className="font-bold">{tokens}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
