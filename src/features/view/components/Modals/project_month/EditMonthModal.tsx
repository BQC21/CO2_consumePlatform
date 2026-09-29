"use client";

import { MonthFormModal } from "@/features/view/components/Modals/project_month/MonthFormModal";
import { createProjectMonthFormStateFromProjectMonth } from "@/features/model/mapping/mapping_project_month";
import { EditMonthModalProps } from "@/lib/types/components/components";

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
