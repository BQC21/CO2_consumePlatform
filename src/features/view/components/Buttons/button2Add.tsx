"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/icons";
import { Button2AddProps } from "@/lib/types/components/components";

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
