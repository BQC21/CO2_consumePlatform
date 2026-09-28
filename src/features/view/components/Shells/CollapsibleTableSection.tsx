"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type CollapsibleTableSectionProps = {
  title: string;
  meta?: string;
  children: ReactNode;
};

export function CollapsibleTableSection({ title, meta, children }: CollapsibleTableSectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <section>
      <button type="button" className="mb-2 text-sm font-semibold" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        {open ? "▾" : "▸"} {title}
        {meta ? <span className="ml-2 font-normal text-[var(--color-text-secondary)]">{meta}</span> : null}
      </button>
      {open ? children : null}
    </section>
  );
}
