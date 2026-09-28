"use client";

import { useState } from "react";
import type { ExcelWorkbookSheet } from "@/lib/types/components/workbook-types";

type ExcelWorkbookProps = {
  sheets: ExcelWorkbookSheet[];
  defaultSheetId?: string;
  layout?: "split" | "tabs";
};

export function ExcelWorkbook({ sheets, defaultSheetId, layout = "split" }: ExcelWorkbookProps) {
  const [active, setActive] = useState(defaultSheetId ?? sheets[0]?.id ?? "");

  if (layout === "split") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
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

  const current = sheets.find((sheet) => sheet.id === active) ?? sheets[0];
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
