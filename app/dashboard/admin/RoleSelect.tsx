"use client";

import { useRef, useState } from "react";

const ROLES = [
  { value: "student",  label: "طالب",  color: "border-purple-500/50 text-purple-300 bg-purple-900/40" },
  { value: "teacher",  label: "معلم",  color: "border-amber-500/50 text-amber-400 bg-amber-500/10" },
  { value: "graduate", label: "خريج",  color: "border-green-500/50 text-green-400 bg-green-500/10" },
  { value: "admin",    label: "مدير",  color: "border-red-500/50 text-red-400 bg-red-500/10" },
];

export function RoleSelect({
  currentRole,
  action,
}: {
  currentRole: string;
  action: (fd: FormData) => Promise<void>;
}) {
  const [selected, setSelected] = useState(currentRole || "student");
  const formRef = useRef<HTMLFormElement>(null);
  const roleData = ROLES.find((r) => r.value === selected) ?? ROLES[0];

  return (
    <form ref={formRef} action={action}>
      <select
        name="combined"
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          formRef.current?.requestSubmit();
        }}
        className={`h-7 text-xs border rounded-full px-3 pr-7 text-center focus:outline-none transition-colors cursor-pointer ${roleData.color}`}
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </form>
  );
}
