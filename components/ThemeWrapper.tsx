"use client";

import { useTheme, type ThemeName, type ThemeMode } from "./ThemeProvider";

interface ThemeVars {
  "--bg-page": string;
  "--bg-card": string;
  "--bg-card-2": string;
  "--accent": string;
  "--accent-2": string;
  "--cta": string;
  "--cta-text": string;
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
      "--bg-card":       "#0A3F50",   // clearly lighter teal
      "--bg-card-2":     "#104F64",   // even lighter
      "--accent":        "#268BD2",
      "--accent-2":      "#2AA198",
      "--cta":           "#CB4B16",
      "--cta-text":      "#FDF6E3",
      "--text":          "#93A1A1",
      "--text-bright":   "#EEE8D5",
      "--text-muted":    "#4F6369",
      "--border":        "rgba(38,139,210,0.14)",
      "--border-accent": "rgba(38,139,210,0.38)",
    },
    light: {
      "--bg-page":       "#FDF6E3",
      "--bg-card":       "#E9DFB8",   // clearly darker cream
      "--bg-card-2":     "#D9CE98",   // even darker
      "--accent":        "#1A6FAA",
      "--accent-2":      "#2AA198",
      "--cta":           "#B58900",
      "--cta-text":      "#FFFFFF",
      "--text":          "#536970",
      "--text-bright":   "#073642",
      "--text-muted":    "#93A1A1",
      "--border":        "rgba(38,139,210,0.18)",
      "--border-accent": "rgba(38,139,210,0.42)",
    },
  },

  earth: {
    dark: {
      "--bg-page":       "#2F2A25",
      "--bg-card":       "#443D35",   // clearly lighter brown
      "--bg-card-2":     "#534B40",   // even lighter
      "--accent":        "#B89A6A",   // warm tan (readable on dark bg)
      "--accent-2":      "#7DA44A",   // olive-green secondary
      "--cta":           "#C0652A",
      "--cta-text":      "#FFF8F0",
      "--text":          "#C8B99C",
      "--text-bright":   "#F5F1E8",
      "--text-muted":    "#7D6F60",
      "--border":        "rgba(184,154,106,0.14)",
      "--border-accent": "rgba(184,154,106,0.38)",
    },
    light: {
      "--bg-page":       "#F5F1E8",
      "--bg-card":       "#DCCFB4",   // clearly darker
      "--bg-card-2":     "#C9BA9A",   // even darker
      "--accent":        "#5C6B00",   // dark olive
      "--accent-2":      "#7A4520",
      "--cta":           "#A0522D",
      "--cta-text":      "#FFFFFF",
      "--text":          "#4A3728",
      "--text-bright":   "#2A1A0A",
      "--text-muted":    "#7D6B5A",
      "--border":        "rgba(92,107,0,0.18)",
      "--border-accent": "rgba(92,107,0,0.42)",
    },
  },

  arctic: {
    dark: {
      "--bg-page":       "#0A1F2E",
      "--bg-card":       "#0D3048",   // clearly lighter navy
      "--bg-card-2":     "#124060",   // even lighter
      "--accent":        "#00B4D8",
      "--accent-2":      "#0077B6",
      "--cta":           "#90E0EF",
      "--cta-text":      "#012050",
      "--text":          "#ADE8F4",
      "--text-bright":   "#CAF0F8",
      "--text-muted":    "#4090A8",
      "--border":        "rgba(0,180,216,0.14)",
      "--border-accent": "rgba(0,180,216,0.38)",
    },
    light: {
      "--bg-page":       "#EAF6FF",
      "--bg-card":       "#BEDFF8",   // clearly darker blue-white
      "--bg-card-2":     "#9ACCED",   // even darker
      "--accent":        "#005B8A",
      "--accent-2":      "#00B4D8",
      "--cta":           "#013A80",
      "--cta-text":      "#FFFFFF",
      "--text":          "#014060",
      "--text-bright":   "#012050",
      "--text-muted":    "#3A8AAA",
      "--border":        "rgba(0,91,138,0.18)",
      "--border-accent": "rgba(0,91,138,0.42)",
    },
  },

  neon: {
    dark: {
      "--bg-page":       "#0D0D0D",
      "--bg-card":       "#1C0A1C",   // clearly lighter dark purple
      "--bg-card-2":     "#2A1030",   // even lighter
      "--accent":        "#FF007F",
      "--accent-2":      "#BF00FF",
      "--cta":           "#00F5FF",
      "--cta-text":      "#0D0D0D",
      "--text":          "#F0F0F0",
      "--text-bright":   "#FFFFFF",
      "--text-muted":    "#808080",
      "--border":        "rgba(255,0,127,0.14)",
      "--border-accent": "rgba(255,0,127,0.38)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#F0DEFF",   // clearly distinct purple-tint
      "--bg-card-2":     "#E5CCFF",   // even more distinct
      "--accent":        "#BB0060",
      "--accent-2":      "#9900CC",
      "--cta":           "#0099AA",
      "--cta-text":      "#FFFFFF",
      "--text":          "#2D1030",
      "--text-bright":   "#120018",
      "--text-muted":    "#60506A",
      "--border":        "rgba(187,0,96,0.18)",
      "--border-accent": "rgba(187,0,96,0.42)",
    },
  },

  pastel: {
    dark: {
      "--bg-page":       "#1E1E2E",
      "--bg-card":       "#2C2B44",   // clearly lighter
      "--bg-card-2":     "#3A3858",   // even lighter
      "--accent":        "#D080C8",   // lighter mauve (readable on dark)
      "--accent-2":      "#7EC8C8",   // teal-mint secondary
      "--cta":           "#D4477B",
      "--cta-text":      "#FFF0F8",
      "--text":          "#E0D0F0",
      "--text-bright":   "#F5EEFF",
      "--text-muted":    "#8878A8",
      "--border":        "rgba(208,128,200,0.14)",
      "--border-accent": "rgba(208,128,200,0.38)",
    },
    light: {
      "--bg-page":       "#FFE5D9",
      "--bg-card":       "#F5CBBA",   // clearly darker peach
      "--bg-card-2":     "#EAB5A0",   // even darker
      "--accent":        "#8A2A78",
      "--accent-2":      "#2A8A88",
      "--cta":           "#C43570",
      "--cta-text":      "#FFFFFF",
      "--text":          "#5A4560",
      "--text-bright":   "#3D2850",
      "--text-muted":    "#8A7898",
      "--border":        "rgba(138,42,120,0.18)",
      "--border-accent": "rgba(138,42,120,0.42)",
    },
  },

  mono: {
    dark: {
      "--bg-page":       "#131313",
      "--bg-card":       "#202020",   // clearly lighter
      "--bg-card-2":     "#2E2E2E",   // even lighter
      "--accent":        "#C8C8C8",
      "--accent-2":      "#909090",
      "--cta":           "#E8E8E8",
      "--cta-text":      "#131313",
      "--text":          "#B0B0B0",
      "--text-bright":   "#F0F0F0",
      "--text-muted":    "#606060",
      "--border":        "rgba(255,255,255,0.08)",
      "--border-accent": "rgba(255,255,255,0.20)",
    },
    light: {
      "--bg-page":       "#F5F5F5",
      "--bg-card":       "#E3E3E3",   // clearly darker
      "--bg-card-2":     "#D0D0D0",   // even darker
      "--accent":        "#303030",
      "--accent-2":      "#585858",
      "--cta":           "#1A1A1A",
      "--cta-text":      "#F5F5F5",
      "--text":          "#444444",
      "--text-bright":   "#1A1A1A",
      "--text-muted":    "#808080",
      "--border":        "rgba(0,0,0,0.10)",
      "--border-accent": "rgba(0,0,0,0.22)",
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
