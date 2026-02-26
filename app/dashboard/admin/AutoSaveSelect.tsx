"use client";

import { useRef } from "react";

export function AutoSaveSelect({
  name,
  defaultValue,
  action,
  className,
  children,
}: {
  name: string;
  defaultValue: string;
  action: (fd: FormData) => Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <div className="relative inline-block">
        <select
          name={name}
          defaultValue={defaultValue}
          onChange={() => formRef.current?.requestSubmit()}
          className={`appearance-none pl-6 ${className ?? ""}`}
        >
          {children}
        </select>
        {/* RTL: arrow on the left side */}
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[9px] opacity-50">
          ▾
        </span>
      </div>
    </form>
  );
}
