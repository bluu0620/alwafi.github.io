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
      <select
        name={name}
        defaultValue={defaultValue}
        onChange={() => formRef.current?.requestSubmit()}
        className={className}
      >
        {children}
      </select>
    </form>
  );
}
