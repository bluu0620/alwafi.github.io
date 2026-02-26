"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";

// Hue rotation per theme (applied on top of base purple/amber palette)
const THEME_HUE: Record<ThemeName, string> = {
  night:   "0deg",
  coral:   "-30deg",
  emerald: "90deg",
  sky:     "155deg",
  indigo:  "210deg",
};

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useTheme();
  const hue = THEME_HUE[theme] ?? "0deg";

  // Dark: just hue-rotate for color theme
  // Light: also invert + hue-rotate(180deg) to flip dark→light while preserving hue
  const filter =
    mode === "light"
      ? `hue-rotate(${hue}) invert(1) hue-rotate(180deg)`
      : `hue-rotate(${hue})`;

  return (
    <div
      data-mode={mode}
      data-theme={theme}
      style={{ filter, transition: "filter 0.4s ease" }}
      className="theme-root"
    >
      {children}
    </div>
  );
}
