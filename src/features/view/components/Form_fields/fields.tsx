import type { ReactNode, SelectHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

export function AddSectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{children}</h3>;
}

export function AddTextField({ label, value, onChange, error, placeholder }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function AddTextAreaField({ label, value, onChange, error }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea className="field-textarea input-focus" value={value} onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function AddNumberField({ label, value, onChange, error }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus numeric" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function AddDateField({ label, value, onChange, error }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus" type="date" value={value} onChange={(event) => onChange(event.target.value)} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function AddReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input excel-calculated" value={value} readOnly />
    </label>
  );
}

type SelectProps = FieldProps & {
  options: readonly string[];
};

export function AddSearchableSelectField({ label, value, onChange, options, error }: SelectProps) {
  const listId = `list-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field-input input-focus" list={listId} value={value} onChange={(event) => onChange(event.target.value)} />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

type NativeSelectProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] };

export function AddSelectField({ label, value, onChange, options, error }: NativeSelectProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select className="field-select input-focus" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Selecciona</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
