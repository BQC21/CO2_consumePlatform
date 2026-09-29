import { Meta, MetaFormState } from "@/lib/types/supabase/project-types";
import { DashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatNumber, formatPercent } from "@/lib/utils/helpers/render/format";
import { useState } from "react";
import { EditIcon } from "../Icons/icons";
import { Progress } from "../../refactor/Progress";
import { MetaModal } from "../../refactor/MetaModal";

export function MetaPanel({ meta, metrics, onSave }: { meta: Meta; 
    metrics: DashboardMetrics; onSave: (form: MetaFormState) => Promise<void> }) {
    const [open, setOpen] = useState(false);
    return (
        <section className="rounded-[var(--radius-lg)] p-4" 
            style={{ background: "var(--color-surface-dark)", color: "var(--color-text-on-dark)" }}>
            <div className="flex items-start justify-between gap-3">
                <div>
                <p className="numeric text-5xl font-bold leading-none">{formatPercent(metrics.avanceAnual)}</p>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>
                    Meta de paneles instalados
                </p>
                </div>
                <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                    {meta.anio}
                </p>
                <p className="numeric text-2xl font-bold">{formatNumber(meta.meta_paneles_anual, 0)}</p>
                <button type="button" className="icon-button dark-focus text-white" 
                        aria-label="Editar meta" onClick={() => setOpen(true)}>
                    <EditIcon />
                </button>
                </div>
            </div>
        <Progress label="Anual" current={metrics.panelesAnio} 
            target={meta.meta_paneles_anual} percent={metrics.avanceAnual} color="var(--color-primary)" />
        <Progress label="Mensual" current={metrics.panelesMes} 
            target={meta.meta_paneles_mensual} percent={metrics.avanceMensual} color="var(--color-success)" />
        {open ? <MetaModal meta={meta} onSave={onSave} onClose={() => setOpen(false)} /> : null}
        </section>
    );
}
