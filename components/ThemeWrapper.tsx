"use client";

import { useTheme, type ThemeName, type ThemeMode } from "./ThemeProvider";

interface ThemeVars {
  "--bg-page": string;
  "--bg-card": string;
  "--bg-card-2": string;
  "--accent": string;
  "--accent-2": string;
  "--cta": string;
  "--text": string;
  "--text-bright": string;
  "--text-muted": string;
  "--border": string;
  "--border-accent": string;
}

const THEMES: Record<ThemeName, Record<ThemeMode, ThemeVars>> = {
  solar: {
    dark: {
      "--bg-page":       "#002B36",
      "--bg-card":       "#073642",
      "--bg-card-2":     "#0A4050",
      "--accent":        "#268BD2",
      "--accent-2":      "#2AA198",
      "--cta":           "#CB4B16",
      "--text":          "#93A1A1",
      "--text-bright":   "#EEE8D5",
      "--text-muted":    "#586E75",
      "--border":        "rgba(38,139,210,0.12)",
      "--border-accent": "rgba(38,139,210,0.35)",
    },
    light: {
      "--bg-page":       "#FDF6E3",
      "--bg-card":       "#EEE8D5",
      "--bg-card-2":     "#E5DFC8",
      "--accent":        "#268BD2",
      "--accent-2":      "#2AA198",
      "--cta":           "#B58900",
      "--text":          "#657B83",
      "--text-bright":   "#073642",
      "--text-muted":    "#93A1A1",
      "--border":        "rgba(38,139,210,0.18)",
      "--border-accent": "rgba(38,139,210,0.40)",
    },
  },
  earth: {
    dark: {
      "--bg-page":       "#2F2A25",
      "--bg-card":       "#3D3730",
      "--bg-card-2":     "#4A4338",
      "--accent":        "#C0652A",
      "--accent-2":      "#556B2F",
      "--cta":           "#C0652A",
      "--text":          "#C8B99C",
      "--text-bright":   "#F5F1E8",
      "--text-muted":    "#8B7D6B",
      "--border":        "rgba(192,101,42,0.12)",
      "--border-accent": "rgba(192,101,42,0.35)",
    },
    light: {
      "--bg-page":       "#F5F1E8",
      "--bg-card":       "#EDE8DC",
      "--bg-card-2":     "#E3DDD0",
      "--accent":        "#6B8E23",
      "--accent-2":      "#8B7355",
      "--cta":           "#A0522D",
      "--text":          "#4A3728",
      "--text-bright":   "#2F2A25",
      "--text-muted":    "#7D6B5A",
      "--border":        "rgba(107,142,35,0.18)",
      "--border-accent": "rgba(107,142,35,0.40)",
    },
  },
  arctic: {
    dark: {
      "--bg-page":       "#0A1F2E",
      "--bg-card":       "#0D2A3D",
      "--bg-card-2":     "#103550",
      "--accent":        "#00B4D8",
      "--accent-2":      "#0077B6",
      "--cta":           "#90E0EF",
      "--text":          "#ADE8F4",
      "--text-bright":   "#CAF0F8",
      "--text-muted":    "#48CAE4",
      "--border":        "rgba(0,180,216,0.12)",
      "--border-accent": "rgba(0,180,216,0.35)",
    },
    light: {
      "--bg-page":       "#EAF6FF",
      "--bg-card":       "#D0EBFF",
      "--bg-card-2":     "#BAE0FF",
      "--accent":        "#0077B6",
      "--accent-2":      "#00B4D8",
      "--cta":           "#023E8A",
      "--text":          "#023E8A",
      "--text-bright":   "#012A5E",
      "--text-muted":    "#0096C7",
      "--border":        "rgba(0,119,182,0.18)",
      "--border-accent": "rgba(0,119,182,0.40)",
    },
  },
  neon: {
    dark: {
      "--bg-page":       "#0D0D0D",
      "--bg-card":       "#1A0A1A",
      "--bg-card-2":     "#220D22",
      "--accent":        "#FF007F",
      "--accent-2":      "#BF00FF",
      "--cta":           "#00F5FF",
      "--text":          "#F0F0F0",
      "--text-bright":   "#FFFFFF",
      "--text-muted":    "#888888",
      "--border":        "rgba(255,0,127,0.12)",
      "--border-accent": "rgba(255,0,127,0.35)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#F5E6FF",
      "--bg-card-2":     "#EDD6FF",
      "--accent":        "#CC0066",
      "--accent-2":      "#9900CC",
      "--cta":           "#0099AA",
      "--text":          "#1A0A1A",
      "--text-bright":   "#000000",
      "--text-muted":    "#555555",
      "--border":        "rgba(204,0,102,0.18)",
      "--border-accent": "rgba(204,0,102,0.40)",
    },
  },
  pastel: {
    dark: {
      "--bg-page":       "#1E1E2E",
      "--bg-card":       "#2A2A40",
      "--bg-card-2":     "#323248",
      "--accent":        "#B565A7",
      "--accent-2":      "#CBA4DA",
      "--cta":           "#D4477B",
      "--text":          "#E0D0F0",
      "--text-bright":   "#F5EEFF",
      "--text-muted":    "#A09AB8",
      "--border":        "rgba(181,101,167,0.12)",
      "--border-accent": "rgba(181,101,167,0.35)",
    },
    light: {
      "--bg-page":       "#FFE5D9",
      "--bg-card":       "#FFD6CC",
      "--bg-card-2":     "#FFC8B8",
      "--accent":        "#9C3587",
      "--accent-2":      "#B565A7",
      "--cta":           "#D4477B",
      "--text":          "#6D6875",
      "--text-bright":   "#3D3045",
      "--text-muted":    "#9B8FA0",
      "--border":        "rgba(156,53,135,0.18)",
      "--border-accent": "rgba(156,53,135,0.40)",
    },
  },
};

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useTheme();
  const vars = THEMES[theme]?.[mode] ?? THEMES.solar.dark;

  return (
    <div
      data-mode={mode}
      data-theme={theme}
      className="theme-root"
      style={{
        ...(vars as React.CSSProperties),
        backgroundColor: vars["--bg-page"],
        color: vars["--text-bright"],
        transition: "background-color 0.4s ease, color 0.4s ease",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
