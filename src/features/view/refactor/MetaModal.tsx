import { createMetaFormStateFromMeta } from "@/features/model/mapping/mapping_meta";
import { Meta, MetaFormState } from "@/lib/types/supabase/project-types";
import { useState } from "react";
import { ModalFrame } from "./ModalFrame";
import { AddNumberField } from "../components/Form_fields/fields";

export function MetaModal({ meta, onSave, onClose }: { 
    meta: Meta; onSave: (form: MetaFormState) => Promise<void>; onClose: () => void }) {
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
