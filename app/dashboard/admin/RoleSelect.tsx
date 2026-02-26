"use client";

import { useRef, useState } from "react";

const ALL_ROLES = [
  { value: "student",  label: "طالب",  color: "border-purple-500/50 text-purple-300 bg-purple-900/40" },
  { value: "teacher",  label: "معلم",  color: "border-amber-500/50 text-amber-400 bg-amber-500/10" },
  { value: "graduate", label: "خريج",  color: "border-green-500/50 text-green-400 bg-green-500/10" },
  { value: "admin",    label: "مدير",  color: "border-red-500/50 text-red-400 bg-red-500/10" },
  { value: "dev",      label: "Dev",   color: "border-cyan-500/50 text-cyan-300 bg-cyan-900/40" },
];

export function RoleSelect({
  currentRole,
  action,
  isDev = false,
}: {
  currentRole: string;
  action: (fd: FormData) => Promise<void>;
  isDev?: boolean;
}) {
  const [selected, setSelected] = useState(currentRole || "student");
  const formRef = useRef<HTMLFormElement>(null);
  const ROLES = isDev ? ALL_ROLES : ALL_ROLES.filter((r) => r.value !== "admin" && r.value !== "dev");
  const roleData = ALL_ROLES.find((r) => r.value === selected) ?? ALL_ROLES[0];

  return (
    <form ref={formRef} action={action}>
      <div className="relative inline-block">
        <select
          name="combined"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            formRef.current?.requestSubmit();
          }}
          className={`appearance-none h-7 text-xs border rounded-full px-4 pl-6 text-center focus:outline-none transition-colors cursor-pointer ${roleData.color}`}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {/* RTL: arrow on the left */}
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] opacity-50">
          ▾
        </span>
      </div>
    </form>
  );
}
