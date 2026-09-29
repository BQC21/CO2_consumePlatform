import { DashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatPercent } from "@/lib/utils/helpers/render/format";
import { useState } from "react";
import { Progress } from "../../refactor/Progress";
import { MetaModal } from "../Modals/MetaModal";
import { Meta, MetaFormState } from "@/lib/types/supabase/meta-types";
import { PeriodSelect } from "@/lib/utils/helpers/filters/filterProjects";
import { MONTH_NAMES } from "@/lib/utils/consts/monthNames";

export function MetaPanel({
    meta,
    metrics,
    years,
    selectedYear,
    selectedMonth,
    monthOptions,
    onYearChange,
    onMonthChange,
    onSave,
}: {
    meta: Meta;
    metrics: DashboardMetrics;
    years: number[];
    selectedYear: number;
    selectedMonth: number;
    monthOptions: number[];
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
    onSave: (form: MetaFormState) => Promise<void>;
}) {

    const [open, setOpen] = useState(false);

    // opciones de año
    const yearOptions = (years.length > 0 ? years : [selectedYear]).map((year) => ({ value: year, label: String(year) }));
    // meses seleccionables
    const selectableMonths = (monthOptions.length > 0 ? monthOptions : [selectedMonth]).map((month) => ({
        value: month,
        label: MONTH_NAMES[month - 1] ?? String(month),
    }));

    return (
        <section
            className="rounded-[var(--radius-lg)] p-4"
            style={{ background: "var(--color-surface-dark)", color: "var(--color-text-on-dark)" }}
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="numeric text-5xl font-bold leading-none">{formatPercent(metrics.avanceAnual)}</p>
                    <p className="mt-2 text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>
                    Meta de paneles instalados
                    </p>
                </div>

                {/* Selectores */}
                <div className="flex flex-1 items-start justify-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <PeriodSelect 
                            label="Seleccionar año" value={selectedYear} 
                            options={yearOptions} onChange={onYearChange} />
                        <p className="text-4xl font-bold leading-none" style={{ color: "#ff4b1f" }}>
                            {selectedYear}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PeriodSelect 
                            label="Seleccionar mes" value={selectedMonth} 
                            options={selectableMonths} onChange={onMonthChange} />
                        <p className="text-4xl font-bold leading-none" style={{ color: "#f0a31a" }}>
                            {MONTH_NAMES[selectedMonth - 1] ?? ""}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-[7.5rem] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-2 text-center text-sm font-semibold leading-tight text-white hover:bg-[var(--color-primary-hover)]"
                    onClick={() => setOpen(true)}
                >
                    Actualizar metas
                </button>
            </div>

            {/* Barras trackeadora de progreso */}

            <Progress
                label="Anual"
                current={metrics.panelesAnio}
                target={meta.meta_paneles_anual}
                percent={metrics.avanceAnual}
                color="var(--color-primary)"
            />

            <Progress
                label="Mensual"
                current={metrics.panelesMes}
                target={meta.meta_paneles_mensual}
                percent={metrics.avanceMensual}
                color="var(--color-success)"
            />

            {/* Modal para editar las metas */}
            {open ? <MetaModal meta={meta} onSave={onSave} onClose={() => setOpen(false)} /> : null}
        </section>
    );
}
