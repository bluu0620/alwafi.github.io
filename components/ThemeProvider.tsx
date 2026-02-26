"use client";

import { createContext, useContext, useState } from "react";

export type ThemeName = "night" | "coral" | "emerald" | "sky" | "indigo";
export type ThemeMode = "dark" | "light";

interface ThemeCtx {
  theme: ThemeName;
  mode: ThemeMode;
  setTheme: (t: ThemeName) => void;
  toggleMode: () => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "night",
  mode: "dark",
  setTheme: () => {},
  toggleMode: () => {},
});

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; max-age=31536000; path=/; SameSite=Lax`;
}

export function ThemeProvider({
  children,
  initialTheme = "night",
  initialMode = "dark",
}: {
  children: React.ReactNode;
  initialTheme?: ThemeName;
  initialMode?: ThemeMode;
}) {
  // Initialize directly from server-read cookie values — no flash
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    setCookie("wafi-theme", t);
  };

  const toggleMode = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setModeState(next);
    setCookie("wafi-mode", next);
  };

  return (
    <Ctx.Provider value={{ theme, mode, setTheme, toggleMode }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
