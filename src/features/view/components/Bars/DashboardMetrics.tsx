"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/icons";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import { AddNumberField } from "@/features/view/components/Form_fields/fields";
import type { DashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import type { Meta, MetaFormState } from "@/lib/types/supabase/project-types";
import { formatNumber, formatPercent } from "@/lib/utils/helpers/render/format";
import { createMetaFormStateFromMeta } from "@/features/model/mapping/mapping_meta";

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
        <p className="text-[0.65rem] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">Proyectos registrados</p>
        <p className="numeric text-3xl font-bold">{metrics.proyectosRegistrados}</p>
      </article>
      <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
        <p className="text-[0.65rem] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">Completados</p>
        <p className="numeric text-3xl font-bold">{metrics.proyectosCompletados}</p>
      </article>
      <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
        <p className="text-[0.65rem] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">Capacidad instalada</p>
        <p className="numeric text-3xl font-bold">{formatNumber(metrics.capacidadInstaladaKwp, 1)} kWp</p>
      </article>
    </div>
  );
}

export function MetaPanel({ meta, metrics, onSave }: { meta: Meta; metrics: DashboardMetrics; onSave: (form: MetaFormState) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-[var(--radius-lg)] p-4" style={{ background: "var(--color-surface-dark)", color: "var(--color-text-on-dark)" }}>
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
          <button type="button" className="icon-button dark-focus text-white" aria-label="Editar meta" onClick={() => setOpen(true)}>
            <EditIcon />
          </button>
        </div>
      </div>
      <Progress label="Anual" current={metrics.panelesAnio} target={meta.meta_paneles_anual} percent={metrics.avanceAnual} color="var(--color-primary)" />
      <Progress label="Mensual" current={metrics.panelesMes} target={meta.meta_paneles_mensual} percent={metrics.avanceMensual} color="var(--color-success)" />
      {open ? <MetaModal meta={meta} onSave={onSave} onClose={() => setOpen(false)} /> : null}
    </section>
  );
}

function Progress({ label, current, target, percent, color }: { label: string; current: number; target: number; percent: number; color: string }) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--color-text-on-dark-muted)" }}>
        <span className="numeric">
          {formatNumber(current, 0)} / {formatNumber(target, 0)}
        </span>
        <span>
          {label} · {formatPercent(percent)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${Math.min(percent, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

function MetaModal({ meta, onSave, onClose }: { meta: Meta; onSave: (form: MetaFormState) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState(createMetaFormStateFromMeta(meta));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la meta.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title="Meta de paneles" onClose={onClose}>
      <form className="grid gap-4 text-[var(--color-text-primary)]" onSubmit={handleSubmit}>
        <AddNumberField label="Año" value={form.anio} onChange={(value) => setForm((current) => ({ ...current, anio: value }))} />
        <AddNumberField label="Meta anual de paneles" value={form.meta_paneles_anual} onChange={(value) => setForm((current) => ({ ...current, meta_paneles_anual: value }))} />
        <AddNumberField label="Meta mensual de paneles" value={form.meta_paneles_mensual} onChange={(value) => setForm((current) => ({ ...current, meta_paneles_mensual: value }))} />
        {error ? <p className="field-error">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Guardando…" : "Guardar meta"}
        </button>
      </form>
    </ModalFrame>
  );
}

export function ProductionGauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <figure className="text-center">
      <svg viewBox="0 0 120 120" className="mx-auto h-36 w-36" aria-hidden="true">
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="10" />
        <circle cx="60" cy="60" r="46" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray="250 289" transform="rotate(-90 60 60)" />
        <text x="60" y="64" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">
          {formatNumber(value, 3)}
        </text>
      </svg>
      <figcaption className="text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>
        {label}
        <span className="mt-1 block text-xs">MWh</span>
      </figcaption>
    </figure>
  );
}
