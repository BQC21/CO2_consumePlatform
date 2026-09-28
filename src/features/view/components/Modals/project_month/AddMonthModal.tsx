"use client";

import { MonthFormModal } from "@/features/view/components/Modals/project_month/MonthFormModal";
import type { Project, ProjectMonthFormState } from "@/lib/types/supabase/project-types";
import { INITIAL_PROJECT_MONTH_FORM } from "@/lib/utils/initialValues";

type AddMonthModalProps = {
  projects: Project[];
  onAdd: (form: ProjectMonthFormState) => Promise<void>;
  onClose: () => void;
};

export function AddMonthModal({ projects, onAdd, onClose }: AddMonthModalProps) {
  return <MonthFormModal title="Nuevo registro mensual" initial={INITIAL_PROJECT_MONTH_FORM} projects={projects} onSubmit={onAdd} onClose={onClose} />;
}
