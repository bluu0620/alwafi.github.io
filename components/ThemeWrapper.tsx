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
  // ── LIBRARY CLASSIC ────────────────────────────────────────────────────────
  library: {
    dark: {
      "--bg-page":       "#1C1F24",
      "--bg-card":       "#252A32",
      "--bg-card-2":     "#2E3440",
      "--accent":        "#4F81C7",   // steel blue
      "--accent-2":      "#C2A878",   // warm tan
      "--cta":           "#C2A878",
      "--cta-text":      "#1C1F24",
      "--text":          "#A8A29A",
      "--text-bright":   "#E6E1D9",
      "--text-muted":    "#6B6560",
      "--border":        "rgba(79,129,199,0.14)",
      "--border-accent": "rgba(79,129,199,0.38)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#EDE8DF",
      "--bg-card-2":     "#DDD6C8",
      "--accent":        "#1E3A5F",   // deep navy blue
      "--accent-2":      "#7A5C3E",   // warm brown
      "--cta":           "#7A5C3E",
      "--cta-text":      "#FFFFFF",
      "--text":          "#3A3530",
      "--text-bright":   "#1A1512",
      "--text-muted":    "#7A7265",
      "--border":        "rgba(30,58,95,0.15)",
      "--border-accent": "rgba(30,58,95,0.40)",
    },
  },

  // ── SCIENCE LAB ────────────────────────────────────────────────────────────
  science: {
    dark: {
      "--bg-page":       "#182028",
      "--bg-card":       "#1F2C36",
      "--bg-card-2":     "#263845",
      "--accent":        "#2EC4B6",   // teal
      "--accent-2":      "#90E0EF",   // light cyan
      "--cta":           "#2EC4B6",
      "--cta-text":      "#0F2027",
      "--text":          "#8EC8CC",
      "--text-bright":   "#E0FBFC",
      "--text-muted":    "#4A7880",
      "--border":        "rgba(46,196,182,0.14)",
      "--border-accent": "rgba(46,196,182,0.38)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#E2EEF0",
      "--bg-card-2":     "#C8E0E4",
      "--accent":        "#006D77",   // deep teal
      "--accent-2":      "#008B8B",
      "--cta":           "#006D77",
      "--cta-text":      "#FFFFFF",
      "--text":          "#1B2830",
      "--text-bright":   "#0A1218",
      "--text-muted":    "#3A7880",
      "--border":        "rgba(0,109,119,0.15)",
      "--border-accent": "rgba(0,109,119,0.42)",
    },
  },

  // ── CAMPUS MODERN ──────────────────────────────────────────────────────────
  campus: {
    dark: {
      "--bg-page":       "#17191D",
      "--bg-card":       "#1E2530",
      "--bg-card-2":     "#252E38",
      "--accent":        "#84A98C",   // sage green
      "--accent-2":      "#52796F",   // muted teal
      "--cta":           "#84A98C",
      "--cta-text":      "#121417",
      "--text":          "#9EB0A8",
      "--text-bright":   "#DCE1E3",
      "--text-muted":    "#4A5860",
      "--border":        "rgba(132,169,140,0.14)",
      "--border-accent": "rgba(132,169,140,0.38)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#E5EBE8",
      "--bg-card-2":     "#D2DCD8",
      "--accent":        "#2F3E46",   // slate teal
      "--accent-2":      "#3A5A40",   // forest green
      "--cta":           "#3A5A40",
      "--cta-text":      "#FFFFFF",
      "--text":          "#252C2A",
      "--text-bright":   "#111918",
      "--text-muted":    "#5A6868",
      "--border":        "rgba(47,62,70,0.15)",
      "--border-accent": "rgba(47,62,70,0.40)",
    },
  },

  // ── ACADEMIC AUTHORITY ─────────────────────────────────────────────────────
  authority: {
    dark: {
      "--bg-page":       "#1C1914",
      "--bg-card":       "#262018",
      "--bg-card-2":     "#302820",
      "--accent":        "#B08968",   // warm tan
      "--accent-2":      "#E6CCB2",   // parchment
      "--cta":           "#B08968",
      "--cta-text":      "#1B1410",
      "--text":          "#C4AA90",
      "--text-bright":   "#F5EBE0",
      "--text-muted":    "#7A6550",
      "--border":        "rgba(176,137,104,0.14)",
      "--border-accent": "rgba(176,137,104,0.38)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#EDE3D5",
      "--bg-card-2":     "#DDD0BE",
      "--accent":        "#5E3023",   // dark auburn
      "--accent-2":      "#9C6644",   // warm brown
      "--cta":           "#9C6644",
      "--cta-text":      "#FFFFFF",
      "--text":          "#2A1A13",
      "--text-bright":   "#180A06",
      "--text-muted":    "#7A6558",
      "--border":        "rgba(94,48,35,0.15)",
      "--border-accent": "rgba(94,48,35,0.40)",
    },
  },

  // ── STEM FOCUS ─────────────────────────────────────────────────────────────
  stem: {
    dark: {
      "--bg-page":       "#141A2C",
      "--bg-card":       "#1C2440",
      "--bg-card-2":     "#232D50",
      "--accent":        "#5BC0BE",   // cyan-teal
      "--accent-2":      "#C5E5E8",   // ice blue
      "--cta":           "#5BC0BE",
      "--cta-text":      "#0B132B",
      "--text":          "#9ABCD0",
      "--text-bright":   "#EAF4F4",
      "--text-muted":    "#485A78",
      "--border":        "rgba(91,192,190,0.14)",
      "--border-accent": "rgba(91,192,190,0.38)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#E2EAF2",
      "--bg-card-2":     "#CDD9E8",
      "--accent":        "#003049",   // deep navy
      "--accent-2":      "#669BBC",   // steel blue
      "--cta":           "#003049",
      "--cta-text":      "#FFFFFF",
      "--text":          "#111827",
      "--text-bright":   "#060912",
      "--text-muted":    "#4A6880",
      "--border":        "rgba(0,48,73,0.15)",
      "--border-accent": "rgba(0,48,73,0.40)",
    },
  },

  // ── MONO ───────────────────────────────────────────────────────────────────
  mono: {
    dark: {
      "--bg-page":       "#1A1A1A",
      "--bg-card":       "#252525",
      "--bg-card-2":     "#333333",
      "--accent":        "#C8C8C8",
      "--accent-2":      "#909090",
      "--cta":           "#E8E8E8",
      "--cta-text":      "#1A1A1A",
      "--text":          "#B0B0B0",
      "--text-bright":   "#F0F0F0",
      "--text-muted":    "#606060",
      "--border":        "rgba(255,255,255,0.08)",
      "--border-accent": "rgba(255,255,255,0.20)",
    },
    light: {
      "--bg-page":       "#FFFFFF",
      "--bg-card":       "#E8E8E8",
      "--bg-card-2":     "#D5D5D5",
      "--accent":        "#303030",
      "--accent-2":      "#585858",
      "--cta":           "#1A1A1A",
      "--cta-text":      "#FFFFFF",
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
  const vars = THEMES[theme]?.[mode] ?? THEMES.library.dark;

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
