"use client";

import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import { MassiveDownloadModalProps } from "@/lib/types/components/components";
import { downloadWorkbook } from "@/lib/utils/helpers/massive/buildWorkbook";

export function MassiveDownloadModal({ title, filename, headers, rows, onClose }: MassiveDownloadModalProps) {
  return (
    <ModalFrame title={title} onClose={onClose}>
      <div className="grid gap-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Se descargará la plantilla con {rows.length} filas visibles. Las celdas calculadas no viajan: se reconstruyen al leer.
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            downloadWorkbook(filename, headers, rows);
            onClose();
          }}
        >
          Descargar Excel
        </button>
      </div>
    </ModalFrame>
  );
}
