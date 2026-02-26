"use client";

import { useState, useTransition } from "react";
import { saveTeacherSubjects } from "../../subject-actions";

export function SubjectFilterPanel({
  levelId,
  allSubjects,
  chosenSubjects,
}: {
  levelId: string;
  allSubjects: { name: string; icon: string }[];
  chosenSubjects: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    chosenSubjects.length > 0 ? new Set(chosenSubjects) : new Set(allSubjects.map((s) => s.name))
  );
  const [pending, startTransition] = useTransition();

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const save = () => {
    startTransition(async () => {
      const list = Array.from(selected);
      // If all are selected, save empty array (means "show all")
      const toSave = list.length === allSubjects.length ? [] : list;
      await saveTeacherSubjects(levelId, toSave);
      setOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-700/30 text-purple-300/60 hover:text-purple-300 hover:border-purple-500/40 transition"
      >
        ⚙️ المواد
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-20 w-52 bg-[#1a1030] border border-purple-700/40 rounded-2xl shadow-2xl p-3">
          <p className="text-xs font-bold text-purple-300/50 mb-2 px-1">اختر المواد التي تراها</p>
          <div className="space-y-1 mb-3">
            {allSubjects.map((s) => (
              <label
                key={s.name}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-purple-900/40 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selected.has(s.name)}
                  onChange={() => toggle(s.name)}
                  className="accent-amber-500 w-3.5 h-3.5"
                />
                <span className="text-sm">{s.icon}</span>
                <span className="text-sm text-white/80">{s.name}</span>
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
