"use client";

import { useState } from "react";

const ROLES = [
  { value: "student", label: "طالب", color: "border-purple-500/50 text-purple-300 bg-purple-900/40" },
  { value: "teacher", label: "معلم", color: "border-amber-500/50 text-amber-400 bg-amber-500/10" },
  { value: "graduate", label: "خريج", color: "border-green-500/50 text-green-400 bg-green-500/10" },
  { value: "admin", label: "مدير", color: "border-red-500/50 text-red-400 bg-red-500/10" },
];

export function RoleSelect({
  currentRole,
  action,
}: {
  currentRole: string;
  action: (fd: FormData) => Promise<void>;
}) {
  const [selected, setSelected] = useState(currentRole || "student");
  const roleData = ROLES.find((r) => r.value === selected) ?? ROLES[0];

  return (
    <form action={action} className="flex items-center gap-1">
      <select
        name="role"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className={`text-xs border rounded-lg px-2 py-1 focus:outline-none transition-colors cursor-pointer ${roleData.color}`}
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition"
      >
        حفظ
      </button>
    </form>
  );
}
