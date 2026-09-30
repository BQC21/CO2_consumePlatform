"use client";

import { useState } from "react";
import { TrashIcon } from "@/features/view/components/Icons/icons";
import { Button2DeleteProps } from "@/lib/types/components/components";

export function Button2Delete({ label, children }: Button2DeleteProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="icon-button" style={{ color: "var(--color-error)" }} aria-label={label} onClick={() => setOpen(true)}>
        <TrashIcon />
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}
