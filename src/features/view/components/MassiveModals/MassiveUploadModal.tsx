"use client";

import { useState } from "react";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { assertHeaders, readSheetRows } from "@/lib/utils/helpers/massive/parseWorkbook";
import { MassiveUploadModalProps } from "@/lib/types/components/components";

export function MassiveUploadModal({ title, description, expectedHeaders, onRows, onClose }: MassiveUploadModalProps) {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setError("");
    setRows(null);
    setFileName(file.name);
    try {
      const parsed = readSheetRows(await file.arrayBuffer());
      assertHeaders(parsed, expectedHeaders);
      setRows(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rows) {
      setError("Selecciona un Excel con las columnas de la plantilla.");
      return;
    }
    setBusy(true);
    try {
      await onRows(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={title} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
        <div>
          <p className="field-label">Archivo Excel</p>
          <label className={`btn-secondary w-full cursor-pointer ${busy ? "pointer-events-none opacity-45" : ""}`}>
            Seleccionar archivo
            <input
              className="sr-only"
              type="file"
              accept=".xlsx,.xls"
              disabled={busy}
              onChange={(event) => {
                const input = event.currentTarget;
                const file = input.files?.[0];
                input.value = "";
                if (file) {
                  void handleFile(file);
                }
              }}
            />
          </label>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {fileName || "Ningún archivo seleccionado"}
          </p>
          {fileName && rows ? <p className="text-sm">{rows.length} filas listas.</p> : null}
        </div>
        {error ? <p className="field-error">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={busy || !rows}>
          {busy ? "Importando…" : "Importar"}
        </button>
      </form>
    </ModalFrame>
  );
}
