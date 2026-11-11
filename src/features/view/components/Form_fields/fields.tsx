import { FieldProps, NativeSelectProps } from "@/lib/types/components/components";
import { REQUIRED_MESSAGE } from "@/lib/utils/consts/messages";
import { normalizeSelectOptions, publicMediaSrc } from "@/lib/utils/helpers/normalization";
import { type FormEvent, type ReactNode } from "react";
import { ImpactIcon } from "../Icons/icons";
import { DashboardPeriod } from "@/lib/types/components/options";
import { periodYears } from "@/lib/utils/helpers/render/DateRender";
import { tones } from "@/lib/utils/consts/design";

// ----------------------------------------------
// ---- Condicionar el requerimiento del campo --
// ----------------------------------------------

// Requieren un asterisco
function markRequired(event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  event.currentTarget.setCustomValidity(REQUIRED_MESSAGE);
}

// No se requiere un asterisco
function clearRequired(event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  event.currentTarget.setCustomValidity("");
}

// Label principal de campo
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="field-label">
      {label}
      {required ? <span className="text-red-500"> *</span> : null}
    </span>
  );
}

// ----------------------------------------------
// -------------- Componentes -------------------
// ----------------------------------------------

// Título de sección
export function AddSectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{children}</h3>;
}

// Campo de texto
export function AddTextField({ label, required, value, onChange, error, placeholder, disabled }: FieldProps) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input
        className={`field-input input-focus ${error ? "border-[var(--color-error)]" : ""}`}
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onInvalid={required ? markRequired : undefined}
        onInput={required ? clearRequired : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo para ingresar números
export function AddNumberField({ label, required = false, value, onChange, error,
  step, min, max, centered = false, disabled, placeholder, suffix }: FieldProps) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div className="relative">
        <input
          className={`field-input input-focus numeric ${suffix ? "pr-16" : ""} ${error ? "border-[var(--color-error)]" : ""}`}
          inputMode="decimal"
          required={required}
          disabled={disabled}
          value={value}
          onInvalid={required ? markRequired : undefined}
          onInput={required ? clearRequired : undefined}
          onChange={(event) => onChange(event.target.value)}
          min={typeof min === "number" && Number.isFinite(min) ? min : undefined}
          step={step === "" || step === undefined ? undefined : String(step)}
          placeholder={placeholder ?? "0"}
        />
        {suffix ? <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[var(--color-text-secondary)]">{suffix}</span> : null}
      </div>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

// Campo para ingresar fecha
export function AddDateField({ label, value, required, onChange, error, disabled }: FieldProps) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input
        className="field-input input-focus"
        type="date"
        required={required}
        disabled={disabled}
        value={value}
        onInvalid={required ? markRequired : undefined}
        onInput={required ? clearRequired : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo selector
export function AddSelectField({ label, required, value, onChange, options, error, disabled }: NativeSelectProps) {
  const normalizedOptions = normalizeSelectOptions(options);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <select
        className={`field-select input-focus ${error ? "border-[var(--color-error)]" : ""}`}
        value={value}
        required={required}
        disabled={disabled}
        onInvalid={required ? markRequired : undefined}
        onInput={required ? clearRequired : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {required ? <option value="">Selecciona</option> : null}
        {normalizedOptions.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo de detalle
export function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}

type ImpactIconName = "truck" | "factory" | "tree" | "bolt";

// Condicionamiento
function isIconImage(icon: ImpactIconName | `/ICONOS/${string}`): icon is `/ICONOS/${string}` {
  return icon.startsWith("/ICONOS/");
}

// tarjeta de impacto ambiental
export function ImpactTile({
  title,
  value,
  unit,
  tone,
  icon,
}: {
  title: string;
  value: string;
  unit: string;
  tone: string;
  icon: ImpactIconName | `/ICONOS/${string}`;
}) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl text-white" 
          style={{ background: tone }} aria-hidden="true">
        {isIconImage(icon) ? (
          <img src={publicMediaSrc(icon)} alt="" className="h-8 w-8 object-contain" />
        ) : (
          <ImpactIcon name={icon} />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold text-white/70 sm:text-lg">{title}</p>
        <p className="numeric text-2xl font-bold leading-tight sm:text-3xl">
          {value} {unit ? <span className="text-base font-semibold text-white/80 sm:text-lg">{unit}</span> : null}
        </p>
      </div>
    </article>
  );
}

// selector de años
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
    <div className="flex max-w-full flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--color-text-secondary)]">Año</span>
      <div className="flex max-w-full flex-wrap rounded-full bg-[var(--color-surface-muted)] p-0.5" role="group" aria-label="Año de la gráfica">
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

// selector de periodo
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
    <div className="flex max-w-full flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--color-text-secondary)]">Periodo</span>
      <div className="flex max-w-full flex-wrap rounded-full bg-[var(--color-surface-muted)] p-0.5" role="group" aria-label="Periodo">
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

// Vista moderna de tarjeta
export function MetricTile({
  label,
  value,
  detail,
  tone,
  children,
}: {
  label: string;
  value: string;
  detail: string;
  tone: keyof typeof tones;
  children?: ReactNode;
}) {
  const style = tones[tone];

  return (
    <article className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl px-4 py-4 shadow-[var(--shadow-sm)] ring-1 @container/tile ${style.card}`}>
      <span className={`absolute top-4 right-4 h-2.5 w-2.5 rounded-full ${style.mark}`} aria-hidden="true" />
      <p className="pr-5 text-[1.48rem] font-semibold leading-snug tracking-[0.08em] text-[var(--color-text-secondary)]">{label}</p>
      <p className={`numeric mt-2 text-[clamp(1.5rem,22cqi,2.75rem)] font-bold leading-none ${style.value}`}>{value}</p>
      <p className="mt-2 text-[0.88rem] font-medium leading-snug text-[var(--color-text-primary)]">{detail}</p>
      {children ? <div className="pt-3">{children}</div> : null}
    </article>
  );
}