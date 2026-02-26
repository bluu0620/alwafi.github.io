"use client";

import { useState, useTransition } from "react";
import { updateLevelConfig, resetLevelConfig } from "./actions";

interface Subject {
  name: string;
  icon: string;
}

export function LevelEditorClient({
  levelId,
  defaultName,
  defaultShortName,
  defaultLeader,
  defaultSubjects,
  isCustomized,
}: {
  levelId: string;
  defaultName: string;
  defaultShortName: string;
  defaultLeader: string;
  defaultSubjects: Subject[];
  isCustomized: boolean;
}) {
  const [name, setName] = useState(defaultName);
  const [shortName, setShortName] = useState(defaultShortName);
  const [leader, setLeader] = useState(defaultLeader);
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSubject = () =>
    setSubjects((prev) => [...prev, { name: "", icon: "📖" }]);

  const removeSubject = (i: number) =>
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));

  const updateSubject = (i: number, field: keyof Subject, value: string) =>
    setSubjects((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );

  const save = () => {
    setError(null);
    setSuccess(false);
    const validSubjects = subjects.filter((s) => s.name.trim());
    if (!validSubjects.length) {
      setError("يجب إضافة مادة واحدة على الأقل");
      return;
    }
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("levelId", levelId);
        fd.append("name", name);
        fd.append("shortName", shortName);
        fd.append("leader", leader);
        fd.append("subjects", JSON.stringify(validSubjects));
        await updateLevelConfig(fd);
        setSuccess(true);
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  const reset = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("levelId", levelId);
      await resetLevelConfig(fd);
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
        <h2 className="text-lg font-bold text-amber-400 mb-5">معلومات المستوى</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-purple-300/60 mb-1.5">اسم المستوى</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-purple-900/40 border border-purple-700/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <div>
            <label className="block text-xs text-purple-300/60 mb-1.5">الاسم المختصر</label>
            <input
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full bg-purple-900/40 border border-purple-700/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-purple-300/60 mb-1.5">اسم المسؤول / القائد</label>
            <input
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              placeholder="أ. اسم المعلم"
              className="w-full bg-purple-900/40 border border-purple-700/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/40"
            />
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-amber-400">المواد الدراسية</h2>
          <button
            type="button"
            onClick={addSubject}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition"
          >
            + إضافة مادة
          </button>
        </div>

        <div className="space-y-2">
          {subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={s.icon}
                onChange={(e) => updateSubject(i, "icon", e.target.value)}
                placeholder="📖"
                className="w-14 bg-purple-900/40 border border-purple-700/40 rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-amber-500/40"
              />
              <input
                value={s.name}
                onChange={(e) => updateSubject(i, "name", e.target.value)}
                placeholder="اسم المادة"
                className="flex-1 bg-purple-900/40 border border-purple-700/40 rounded-xl px-4 py-2 text-sm text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/40"
              />
              <button
                type="button"
                onClick={() => removeSubject(i)}
                disabled={subjects.length === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-900/20 transition disabled:opacity-20"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-purple-300/30 mt-3">أدخل إيموجي في الحقل الأول واسم المادة في الثاني</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {pending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
        {isCustomized && (
          <button
            type="button"
            onClick={reset}
            disabled={pending}
            className="px-4 py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm hover:bg-red-900/30 transition disabled:opacity-50"
          >
            إعادة تعيين للافتراضي
          </button>
        )}
        {success && (
          <span className="text-green-400 text-sm">✓ تم الحفظ</span>
        )}
        {error && (
          <span className="text-red-400 text-sm">{error}</span>
        )}
      </div>
    </div>
  );
}
