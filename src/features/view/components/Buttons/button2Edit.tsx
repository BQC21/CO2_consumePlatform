"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/icons";
import { Button2EditProps } from "@/lib/types/components/components";

export function Button2Edit({ label, children }: Button2EditProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="icon-button" style={{ color: "var(--color-secondary)" }} aria-label={label} onClick={() => setOpen(true)}>
        <EditIcon />
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}
