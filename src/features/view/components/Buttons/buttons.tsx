"use client";

import { useState, type ReactNode } from "react";
import { ChartIcon, CleanIcon, DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from "@/features/view/components/Icons/icons";
import { ProjectMetricsModal } from "@/features/view/components/Modals/project_annual/ProjectMetricsModal";
import { Button2AddProps, Button2DeleteProps } from "@/lib/types/components/components";
import { Project, ProjectFormState } from "@/lib/types/supabase/project-types";

// Botón para añadir
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


// Botón para borrar
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


// Botón operación masiva
function MassiveButton({ label, icon, children }: { label: string; icon: ReactNode; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-secondary" onClick={() => setOpen(true)}>
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
export function MetricsButton({ project, onUpdate }: { project: Project; onUpdate: (id: string, form: ProjectFormState) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="icon-button"
        style={{ color: "var(--color-secondary)" }}
        aria-label={`Gráficas de ${project.nombre}`}
        onClick={() => setOpen(true)}
      >
        <ChartIcon />
      </button>
      {open ? <ProjectMetricsModal project={project} onUpdate={onUpdate} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
