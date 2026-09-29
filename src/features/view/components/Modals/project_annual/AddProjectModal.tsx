"use client";

import { ProjectFormModal } from "@/features/view/components/Modals/project_annual/ProjectFormModal";
import { AddProjectModalProps } from "@/lib/types/components/components";
import { INITIAL_PROJECT_FORM } from "@/lib/utils/initialValues";

export function AddProjectModal({ onAdd, onClose }: AddProjectModalProps) {
  return (
    <ProjectFormModal
      title="Nuevo proyecto"
      submitLabel="Guardar proyecto"
      busyLabel="Guardando…"
      initial={INITIAL_PROJECT_FORM}
      onSubmit={onAdd}
      onClose={onClose}
    />
  );
}
