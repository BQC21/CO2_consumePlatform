import { FieldProps, NativeSelectProps } from "@/lib/types/components/components";
import { REQUIRED_MESSAGE } from "@/lib/utils/consts/messages";
import { normalizeSelectOptions } from "@/lib/utils/helpers/normalization";
import { type FormEvent, type ReactNode } from "react";
import { ImpactIcon } from "../Icons/icons";

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
  icon: "truck" | "factory" | "tree" | "bolt";
}) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: tone }} aria-hidden="true">
        <ImpactIcon name={icon} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-white/70 md:text-base">{title}</p>
        <p className="numeric text-2xl font-bold leading-tight md:text-3xl">
          {value} {unit ? <span className="text-base font-semibold text-white/80">{unit}</span> : null}
        </p>
      </div>
    </article>
  );
}