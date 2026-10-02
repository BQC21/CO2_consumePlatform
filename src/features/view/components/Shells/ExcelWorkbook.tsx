"use client";

import { ExcelWorkbookProps } from "@/lib/types/components/components";
import { useState } from "react";

export function ExcelWorkbook({ sheets, defaultSheetId, layout = "split" }: ExcelWorkbookProps) {
  const [active, setActive] = useState(defaultSheetId ?? sheets[0]?.id ?? "");

  // En caso se separe el layout de la hoja de trabajo
  if (layout === "split") {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        {sheets.map((sheet) => (
          <section key={sheet.id} className="panel p-4">
            <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-section-title)" }}>
              {sheet.label}
            </h2>
            {sheet.content}
          </section>
        ))}
      </div>
    );
  }

  const current = sheets.find((sheet) => sheet.id === active) ?? sheets[0]; // Hoja reciente (no separación)
  
  return (
    <section className="panel p-4">
      {current?.content}
      <div className="mt-3 flex gap-2" role="tablist">
        {sheets.map((sheet) => (
          <button
            key={sheet.id}
            type="button"
            role="tab"
            aria-selected={sheet.id === current?.id}
            className={sheet.id === current?.id ? "nav-pill nav-pill-active" : "nav-pill nav-pill-inactive"}
            onClick={() => setActive(sheet.id)}
          >
            {sheet.label}
          </button>
        ))}
      </div>
    </section>
  );
}
