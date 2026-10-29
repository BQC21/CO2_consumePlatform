"use client";

export type DashboardPeriod = number | "todos";

export function periodYears(now = new Date()): number[] {
  const year = now.getFullYear();
  return [year, year - 1];
}

export function YearSwitcher({
  value,
  onChange,
  years = periodYears(),
}: {
  value: number;
  onChange: (value: number) => void;
  years?: number[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--color-text-secondary)]">Año</span>
      <div className="flex rounded-full bg-[var(--color-surface-muted)] p-0.5" role="group" aria-label="Año de la gráfica">
        {years.map((year) => {
          const active = year === value;
          return (
            <button
              key={year}
              type="button"
              className={`h-8 rounded-full px-3 text-sm font-semibold ${active ? "bg-[var(--color-secondary)] text-white" : "text-[var(--color-text-primary)]"}`}
              aria-pressed={active}
              onClick={() => onChange(year)}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PeriodSwitcher({
  value,
  onChange,
}: {
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
}) {
  const options: { label: string; value: DashboardPeriod }[] = [
    ...periodYears().map((year) => ({ label: String(year), value: year })),
    { label: "Todos", value: "todos" as const },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--color-text-secondary)]">Periodo</span>
      <div className="flex rounded-full bg-[var(--color-surface-muted)] p-0.5" role="group" aria-label="Periodo">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.label}
              type="button"
              className={`h-8 rounded-full px-3 text-sm font-semibold ${active ? "bg-[var(--color-secondary)] text-white" : "text-[var(--color-text-primary)]"}`}
              aria-pressed={active}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
