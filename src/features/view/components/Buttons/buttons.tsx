"use client";

import { useState, type ReactNode } from "react";
import { ChartIcon, CleanIcon, DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from "@/features/view/components/Icons/icons";
import { ProjectMetricsModal } from "@/features/view/components/Modals/project_annual/ProjectMetricsModal";
import { Button2AddProps, Button2DeleteProps } from "@/lib/types/components/components";
import { Project, ProjectFormState } from "@/lib/types/supabase/project-types";

// Botón para añadir
export function Button2Add({ label, compact = false, children }: Button2AddProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={compact ? "btn-primary btn-compact" : "btn-primary"} onClick={() => setOpen(true)}>
        <PlusIcon />
        <span>{label}</span>
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}


// Botón para borrar
export function Button2Delete({ label, labeled = false, children }: Button2DeleteProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={labeled ? "inline-flex h-8 items-center gap-1 rounded-full bg-[#f3f6fa] px-3 text-xs font-medium" : "icon-button"}
        style={labeled ? undefined : { color: "var(--color-error)" }}
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        <TrashIcon />
        {labeled ? <span>Eliminar</span> : null}
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}


// Botón operación masiva
function MassiveButton({ label, icon, children }: { label: string; icon: ReactNode; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-toolbar" onClick={() => setOpen(true)}>
        {icon}
        <span>{label}</span>
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}

// Botón para subida masiva
export function Button2MassiveUpload({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  return (
    <MassiveButton label={label} icon={<UploadIcon />}>
      {children}
    </MassiveButton>
  );
}


// Botón para descarga masiva
export function Button2MassiveDownload({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  return (
    <MassiveButton label={label} icon={<DownloadIcon />}>
      {children}
    </MassiveButton>
  );
}

// Botón para borrado masivo
export function Button2MassiveClean({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  return (
    <MassiveButton label={label} icon={<CleanIcon />}>
      {children}
    </MassiveButton>
  );
}

// Botón para ver las métricas del proyecto
export function MetricsButton({
  project,
  onUpdate,
  labeled = false,
}: {
  project: Project;
  onUpdate: (id: string, form: ProjectFormState) => Promise<void>;
  labeled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={labeled ? "inline-flex h-8 items-center gap-1 rounded-full bg-[#e8f1ff] px-3 text-xs font-semibold text-[var(--color-secondary)]" : "icon-button"}
        style={labeled ? undefined : { color: "var(--color-secondary)" }}
        aria-label={`Métricas de ${project.nombre}`}
        onClick={() => setOpen(true)}
      >
        <ChartIcon />
        {labeled ? <span>Ver métricas</span> : null}
      </button>
      {open ? <ProjectMetricsModal project={project} onUpdate={onUpdate} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
