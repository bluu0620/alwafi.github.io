"use client";

import { useState, useTransition } from "react";
import { saveTeacherLevels } from "./subject-actions";

export function LevelFilterPanel({
  allLevels,
  chosenLevels,
}: {
  allLevels: { id: string; name: string }[];
  chosenLevels: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    chosenLevels.length > 0 ? new Set(chosenLevels) : new Set(allLevels.map((l) => l.id))
  );
  const [pending, startTransition] = useTransition();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const save = () => {
    startTransition(async () => {
      const list = Array.from(selected);
      // Empty array means "show all"
      const toSave = list.length === allLevels.length ? [] : list;
      await saveTeacherLevels(toSave);
      setOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-700/30 text-purple-300/60 hover:text-purple-300 hover:border-purple-500/40 transition"
      >
        ⚙️ المستويات
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-20 w-56 bg-[#1a1030] border border-purple-700/40 rounded-2xl shadow-2xl p-3">
          <p className="text-xs font-bold text-purple-300/50 mb-2 px-1">اختر المستويات التي تراها</p>
          <div className="space-y-1 mb-3 max-h-64 overflow-y-auto">
            {allLevels.map((l) => (
              <label
                key={l.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-purple-900/40 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selected.has(l.id)}
                  onChange={() => toggle(l.id)}
                  className="accent-amber-500 w-3.5 h-3.5"
                />
                <span className="text-sm text-white/80">{l.name}</span>
              </label>
            ))}
          </div>
          <button
            onClick={save}
            disabled={pending}
            className="w-full py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition disabled:opacity-50"
          >
            {pending ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      )}
    </div>
  );
}
