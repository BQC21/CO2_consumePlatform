"use client";

import { MonthFormModal } from "@/features/view/components/Modals/project_month/MonthFormModal";
import { createProjectMonthFormStateFromProjectMonth } from "@/features/model/mapping/mapping_project_month";
import type { Project, ProjectMonth, ProjectMonthFormState } from "@/lib/types/supabase/project-types";

type EditMonthModalProps = {
  month: ProjectMonth;
  projects: Project[];
  onUpdate: (form: ProjectMonthFormState) => Promise<void>;
  onClose: () => void;
};

export function EditMonthModal({ month, projects, onUpdate, onClose }: EditMonthModalProps) {
  return (
    <MonthFormModal
      title="Editar registro mensual"
      initial={createProjectMonthFormStateFromProjectMonth(month)}
      projects={projects}
      onSubmit={onUpdate}
      onClose={onClose}
    />
  );
}
