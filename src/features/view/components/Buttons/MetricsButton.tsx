import { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { useState } from "react";
import { ProjectMetricsModal } from "../Modals/project_annual/ProjectMetricsModal";
import { ChartIcon } from "../Icons/icons";

export function MetricsButton({ project, onUpdate }: { project: Project; 
    onUpdate: (id: string, form: ProjectFormState) => Promise<void>; }) {
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
            {open ? <ProjectMetricsModal project={project} 
                        onUpdate={onUpdate} onClose={() => setOpen(false)} /> : null}
        </>
    );
}