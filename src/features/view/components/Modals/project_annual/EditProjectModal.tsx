"use client";

import { ProjectFormModal } from "@/features/view/components/Modals/project_annual/ProjectFormModal";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";

type EditProjectModalProps = {
  project: Project;
  onUpdate: (form: ProjectFormState) => Promise<void>;
  onClose: () => void;
};

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
