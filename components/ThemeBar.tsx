"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";

const THEMES: { id: ThemeName; label: string; color: string }[] = [
  { id: "solar",  label: "شمسي",  color: "#268BD2" },
  { id: "earth",  label: "طيني",  color: "#C0652A" },
  { id: "arctic", label: "قطبي",  color: "#00B4D8" },
  { id: "neon",   label: "نيون",  color: "#FF007F" },
  { id: "pastel", label: "باستيل", color: "#B565A7" },
];

export function ThemeBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl shadow-2xl"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-card) 90%, transparent)",
        border: "1px solid var(--border-accent)",
      }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase ml-1" style={{ color: "var(--text-muted)" }}>
        ثيم
      </span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          style={{ backgroundColor: t.color }}
          className={`w-6 h-6 rounded-full transition-all duration-200 ${
            theme === t.id
              ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110"
              : "opacity-60 hover:opacity-90 hover:scale-105"
          }`}
        />
      ))}
    </div>
  );
}
