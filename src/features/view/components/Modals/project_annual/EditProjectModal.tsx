"use client";

import { ProjectFormModal } from "@/features/view/components/Modals/project_annual/ProjectFormModal";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import { EditProjectModalProps } from "@/lib/types/components/components";

export function EditProjectModal({ project, onUpdate, onClose }: EditProjectModalProps) {
  return (
    <ProjectFormModal
      title="Editar proyecto"
      submitLabel="Guardar cambios"
      busyLabel="Guardando…"
      initial={createProjectFormStateFromProject(project)}
      onSubmit={onUpdate}
      onClose={onClose}
    />
  );
}
