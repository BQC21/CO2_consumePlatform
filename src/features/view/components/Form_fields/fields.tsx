import { EditIcon } from "@/features/view/components/Icons/icons";
import { FieldProps, NativeSelectProps, SelectProps } from "@/lib/types/components/components";
import { Project } from "@/lib/types/supabase/project-types";
import { REQUIRED_MESSAGE } from "@/lib/utils/consts/messages";
import { normalizeSelectOptions } from "@/lib/utils/helpers/normalization";
import { formatNumber } from "@/lib/utils/helpers/render/format";
import { platformProjectImageName, platformProjectImageUrl } from "@/lib/utils/helpers/render/projectImage";
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

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
        className="field-input input-focus"
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

// Campo de texto largo
export function AddTextAreaField({ label, required, value, onChange, error }: FieldProps) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <textarea
        className="field-textarea input-focus"
        required={required}
        value={value}
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
  step, min, max, centered = false, disabled}: FieldProps) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <label className="mb-2 block text-sm font-bold text-slate-600">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      <input
        className="field-input input-focus numeric"
        inputMode="decimal"
        required={required}
        disabled={disabled}
        value={value}
        onInvalid={required ? markRequired : undefined}
        onInput={required ? clearRequired : undefined}
        onChange={(event) => onChange(event.target.value)}
        min={typeof min === "number" && Number.isFinite(min) ? min : undefined}
        step={step === "" || step === undefined ? undefined : String(step)}
        placeholder={typeof min === "number" && Number.isFinite(min) ? String(min) : "0"}
      />
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
export function AddSearchableSelectField({ label, required, value, onChange, options, error,
  searchPlaceholder = "Buscar..."}: SelectProps) {
  const listId = `list-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input
        className="field-input input-focus"
        list={listId}
        value={value}
        required={required}
        placeholder={searchPlaceholder}
        onInvalid={required ? markRequired : undefined}
        onInput={required ? clearRequired : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
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
export function AddSelectField({ label, required, value, onChange, options, error, disabled }: NativeSelectProps) {
  const normalizedOptions = normalizeSelectOptions(options);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <select
        className="field-select input-focus"
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

// Tarjetas de métricas
export function ImpactCard({
  title,
  annual,
  accumulated,
  unit,
  icon,
}: {
  title: string;
  annual?: number | null;
  accumulated: number | null;
  unit: string;
  icon: string;
}) {
  const annualText = annual === null ? "—" : `${formatNumber(annual, 2)} ${unit}`;
  const accumulatedText = accumulated === null ? "—" : `${formatNumber(accumulated, 2)} ${unit}`;
  return (
    <article className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-3 py-3">
      <div>
        <p className="text-xs font-semibold tracking-wide text-white/80">{title}</p>
        <p className="mt-1 text-[0.7rem] text-[var(--color-text-on-dark-muted)]">Acumulado</p>
        <p className="numeric text-sm font-semibold">{accumulatedText}</p>
      </div>
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#12345c] text-2xl" aria-hidden="true">
        {icon}
      </span>
    </article>
  );
}

// Celda para cambiar imagen asociada 
export function ProjectImageCell({ project, onReplace }: { project: Project; onReplace: (id: string, file: File) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const resetting = useRef(false);
  const storedName = platformProjectImageUrl(project.imagen_url) ? platformProjectImageName(project.imagen_url) : "";

  async function change(file: File) {
    setBusy(true);
    setError("");
    try {
      await onReplace(project.id, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la imagen.");
    } finally {
      setBusy(false);
    }
  }

  function pick(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (resetting.current || busy) {
      return;
    }
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    void change(file).finally(() => {
      resetting.current = true;
      input.value = "";
      resetting.current = false;
    });
  }

  return (
    <div className="flex items-center gap-1">
      <label className="excel-cell excel-image flex min-w-0 flex-1 cursor-pointer items-center truncate" title={error || storedName || "Subir imagen"}>
        <span className={error ? "field-error truncate" : "truncate"}>{busy ? "Subiendo…" : error || storedName || "Subir imagen"}</span>
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          aria-label={`Subir imagen de ${project.nombre}`}
          disabled={busy}
          onChange={pick}
        />
      </label>
      {storedName ? (
        <label
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-[0.35rem] text-[#fff7ed]"
          style={{ background: "var(--color-cell-image)" }}
          title="Cambiar imagen"
        >
          <EditIcon />
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            aria-label={`Cambiar imagen de ${project.nombre}`}
            disabled={busy}
            onChange={pick}
          />
        </label>
      ) : null}
    </div>
  );
}