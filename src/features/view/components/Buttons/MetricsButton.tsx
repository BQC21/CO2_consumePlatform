import { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";
import { Project } from "@/lib/types/supabase/project-types";
import { useState } from "react";
import { ProjectMetricsModal } from "../Modals/project_annual/ProjectMetricsModal";
import { ChartIcon } from "../Icons/icons";

export function MetricsButton({ project, months }: { project: Project; months: MonthlyEnergy[] }) {
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
            {open ? <ProjectMetricsModal project={project} months={months} onClose={() => setOpen(false)} /> : null}
        </>
    );
}