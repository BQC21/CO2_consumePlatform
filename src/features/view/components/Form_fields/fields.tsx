import { FieldProps, NativeSelectProps, SelectProps } from "@/lib/types/components/components";
import { normalizeSelectOptions } from "@/lib/utils/helpers/normalization";
import type { ReactNode } from "react";

// Título de sección
export function AddSectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{children}</h3>;
}

// Campo de texto
export function AddTextField({ label, required, value, onChange, error, placeholder }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus" 
            required={required} value={value} placeholder={placeholder} 
            onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo de texto largo
export function AddTextAreaField({ label, required, value, onChange, error }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea className="field-textarea input-focus" 
                required={required} value={value} 
                onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo para ingresar números
export function AddNumberField({ label, required, value, onChange, error, 
  step, min, max, centered = false}: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus numeric" 
            inputMode="decimal" value={value} required={required}
            onChange={(event) => onChange(event.target.value)} 
            step={step === "" || step === undefined ? undefined : String(step)}
            min={typeof min === "number" && Number.isFinite(min) ? min : undefined}
            max={
                typeof max === "number" && Number.isFinite(max) && max !== Number.POSITIVE_INFINITY &&
                (typeof min !== "number" || !Number.isFinite(min) || max >= min)
                    ? max
                    : undefined
            }/>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo para ingresar fecha
export function AddDateField({ label, value, required, onChange, error }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus" 
            type="date" required={required} value={value} 
            onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo para solo lectura de dato
export function AddReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input excel-calculated" 
            value={value} readOnly />
    </label>
  );
}

// Campo selector con búsqueda
export function AddSearchableSelectField({ label, value, onChange, options, error,
  searchPlaceholder = "Buscar..."}: SelectProps) {
  const listId = `list-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus" 
              list={listId} value={value} placeholder={searchPlaceholder}
              onChange={(event) => onChange(event.target.value)} />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

// Campo selector
export function AddSelectField({ label, required, value, onChange, options, error }: NativeSelectProps) {
  const normalizedOptions = normalizeSelectOptions(options);

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select className="field-select input-focus" 
              value={value} required={required}
              onChange={(event) => onChange(event.target.value)}>
        
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
