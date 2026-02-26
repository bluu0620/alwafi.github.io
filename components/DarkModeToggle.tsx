"use client";

import { useTheme } from "./ThemeProvider";

export function DarkModeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      title={mode === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
      className="w-9 h-9 rounded-full bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-base hover:bg-purple-800/50 transition"
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
