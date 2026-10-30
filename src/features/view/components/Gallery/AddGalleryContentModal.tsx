"use client";

import { useMemo, useRef, useState } from "react";
import { classifyGalleryFile, GALLERY_FILE_ACCEPT } from "@/features/model/services/galleryQueries";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { GALLERY_FORMAT_ERROR } from "@/lib/utils/consts/messages";
import { formatByteSize } from "@/lib/utils/helpers/render/format";

type UploadRow = {
  key: string;
  file: File;
  progress: number;
  status: "uploading" | "ready" | "error";
  message: string;
};

export function AddGalleryContentModal({
  projectName,
  single,
  onUpload,
  onClose,
}: {
  projectName: string;
  single: boolean;
  onUpload: (file: File, onProgress: (ratio: number) => void, signal: AbortSignal) => Promise<void>;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const queueRef = useRef(Promise.resolve());
  const inputRef = useRef<HTMLInputElement>(null);

  const ready = rows.filter((row) => row.status === "ready").length;
  const uploading = rows.some((row) => row.status === "uploading");

  const hint = useMemo(
    () => "Fotos: JPG, PNG, WEBP · Videos: MP4, MOV · Se guardan en Supabase Storage",
    [],
  );

  function close() {
    abortRef.current?.abort();
    onClose();
  }

  function takeFiles(list: FileList | File[]) {
    const incoming = [...list];
    if (incoming.length === 0) {
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const accepted = single ? incoming.slice(0, 1) : incoming;
    const rejected = single ? incoming.slice(1) : [];
    const nextRows: UploadRow[] = [
      ...accepted.map((file) => ({
        key: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        progress: 0,
        status: classifyGalleryFile(file) ? "uploading" as const : "error" as const,
        message: classifyGalleryFile(file) ? "" : GALLERY_FORMAT_ERROR,
      })),
      ...rejected.map((file) => ({
        key: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        progress: 0,
        status: "error" as const,
        message: "Al reemplazar solo se admite un archivo.",
      })),
    ];
    setRows((current) => [...current, ...nextRows]);
    for (const row of nextRows) {
      if (row.status !== "uploading") {
        continue;
      }
      queueRef.current = queueRef.current.then(async () => {
        if (controller.signal.aborted) {
          return;
        }
        try {
          await onUpload(row.file, (ratio) => {
            setRows((current) => current.map((item) => (item.key === row.key ? { ...item, progress: ratio } : item)));
          }, controller.signal);
          setRows((current) => current.map((item) => (item.key === row.key ? { ...item, status: "ready", progress: 1, message: "" } : item)));
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Error al subir el archivo.";
          if (message === "Se canceló la subida.") {
            return;
          }
          setRows((current) => current.map((item) => (item.key === row.key ? { ...item, status: "error", message } : item)));
        }
      });
    }
  }

  return (
    <ModalFrame title={single ? "Reemplazar contenido" : "Añadir contenido"} onClose={close} roomy>
      <p className="-mt-2 mb-4 text-sm text-[var(--color-text-secondary)]">Proyecto: {projectName}</p>
      <button
        type="button"
        className={`grid w-full place-items-center rounded-2xl border border-dashed px-4 py-8 text-center ${dragging ? "border-[var(--color-secondary)] bg-[var(--color-surface-muted)]" : "border-[var(--color-secondary)] bg-[#f7f9fc]"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          takeFiles(event.dataTransfer.files);
        }}
      >
        <span className="text-sm font-semibold">Arrastra fotos o videos aquí</span>
        <span className="mt-1 text-sm text-[var(--color-text-secondary)]">
          o <span className="text-[var(--color-secondary)] underline">selecciona archivos</span> desde tu equipo
        </span>
        <span className="mt-2 text-xs text-[var(--color-text-secondary)]">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={GALLERY_FILE_ACCEPT}
        multiple={!single}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) {
            takeFiles(event.target.files);
          }
          event.target.value = "";
        }}
      />
      {rows.length > 0 ? (
        <div className="mt-4 grid gap-2">
          <p className="text-sm font-semibold">Archivos ({rows.length})</p>
          {rows.map((row) => (
            <div
              key={row.key}
              className={`rounded-xl border px-3 py-2 ${row.status === "error" ? "border-[var(--color-error)] bg-[#fff5f5]" : "border-[var(--border-color)]"}`}
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium">{row.file.name}</span>
                <span className="shrink-0 text-[var(--color-text-secondary)]">{formatByteSize(row.file.size)}</span>
              </div>
              {row.status === "error" ? (
                <p className="mt-1 text-xs text-[var(--color-error)]">{row.message}</p>
              ) : (
                <>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(row.progress * 100)}%`,
                        background: row.status === "ready" ? "var(--color-success)" : "var(--color-info)",
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs" style={{ color: row.status === "ready" ? "var(--color-success)" : "var(--color-info)" }}>
                    {row.status === "ready" ? "Listo" : `Subiendo ${Math.round(row.progress * 100)} %`}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {rows.length === 0 ? "0 listos" : `${ready} de ${rows.length} listos`}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={close}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" disabled={rows.length === 0 || uploading || ready === 0} onClick={close}>
            {uploading ? "Subiendo..." : "Listo"}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
