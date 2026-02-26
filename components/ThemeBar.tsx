"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";

const THEMES: { id: ThemeName; label: string; color: string }[] = [
  { id: "night",   label: "ليلي",   color: "#a855f7" },
  { id: "coral",   label: "مرجاني", color: "#f97316" },
  { id: "emerald", label: "زمردي",  color: "#10b981" },
  { id: "sky",     label: "سماوي",  color: "#06b6d4" },
  { id: "indigo",  label: "أزرق",   color: "#6366f1" },
];

export function ThemeBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0f0f1a]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
      <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase ml-1">
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
