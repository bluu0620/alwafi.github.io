"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";

const THEMES: { id: ThemeName; label: string; color: string }[] = [
  { id: "library",   label: "مكتبة",  color: "#4F81C7" },
  { id: "science",   label: "علوم",   color: "#2EC4B6" },
  { id: "campus",    label: "حرم",    color: "#84A98C" },
  { id: "authority", label: "رصين",   color: "#B08968" },
  { id: "stem",      label: "تقني",   color: "#5BC0BE" },
  { id: "mono",      label: "أحادي",  color: "#888888" },
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
