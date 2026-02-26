"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";

const THEMES: { id: ThemeName; label: string; color: string }[] = [
  { id: "solar",  label: "شمسي",   color: "#268BD2" },
  { id: "earth",  label: "طيني",   color: "#C0652A" },
  { id: "arctic", label: "قطبي",   color: "#00B4D8" },
  { id: "neon",   label: "نيون",   color: "#FF007F" },
  { id: "pastel", label: "باستيل", color: "#D080C8" },
  { id: "mono",   label: "كلاسيك", color: "#888888" },
];

export function ThemeBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          style={{ backgroundColor: t.color }}
          className={`w-5 h-5 rounded-full transition-all duration-200 ${
            theme === t.id
              ? "ring-2 ring-white/70 ring-offset-1 ring-offset-transparent scale-115"
              : "opacity-50 hover:opacity-80 hover:scale-105"
          }`}
        />
      ))}
    </div>
  );
}
