"use client";

import { MonthFormModal } from "@/features/view/components/Modals/project_month/MonthFormModal";
import { AddMonthModalProps } from "@/lib/types/components/components";
import { INITIAL_PROJECT_MONTH_FORM } from "@/lib/utils/initialValues";

export function AddMonthModal({ projects, onAdd, onClose }: AddMonthModalProps) {
  return <MonthFormModal 
    title="Nuevo registro mensual" 
    initial={INITIAL_PROJECT_MONTH_FORM} 
    projects={projects} 
    onSubmit={onAdd} onClose={onClose} />;
}
