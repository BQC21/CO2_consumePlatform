"use client";

import { useState, type ReactNode } from "react";
import { PlusIcon } from "@/features/view/components/Icons/icons";

type Button2AddProps = {
  label: string;
  children: (close: () => void) => ReactNode;
};

export function Button2Add({ label, children }: Button2AddProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        <PlusIcon />
        <span>{label}</span>
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}
