"use client";

import { ProjectFormModal } from "@/features/view/components/Modals/project_annual/ProjectFormModal";
import type { ProjectFormState } from "@/lib/types/supabase/project-types";
import { INITIAL_PROJECT_FORM } from "@/lib/utils/initialValues";

type AddProjectModalProps = {
  onAdd: (form: ProjectFormState) => Promise<void>;
  onClose: () => void;
};

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
