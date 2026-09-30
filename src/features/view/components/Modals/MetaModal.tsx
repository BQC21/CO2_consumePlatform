import { createMetaFormStateFromMeta } from "@/features/model/mapping/mapping_meta";
import { useState } from "react";
import { ModalFrame } from "../../refactor/ModalFrame";
import { AddNumberField } from "../Form_fields/fields";
import { Meta, MetaFormState } from "@/lib/types/supabase/meta-types";

export function MetaModal({ meta, onSave, onClose }: { 
    meta: Meta; onSave: (form: MetaFormState) => Promise<void>; onClose: () => void }) 
{
    // -----------------------
    // ----- Estados ---------
    // -----------------------

    const [form, setForm] = useState<MetaFormState>(createMetaFormStateFromMeta(meta)); // formulario
    const [busy, setBusy] = useState(false); // ocupado ?
    const [error, setError] = useState(""); // mensaje de error

    // -----------------------
    // ----- Funciones -------
    // -----------------------

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

    // -----------------------
    // ----- Renderizado -----
    // -----------------------

    return (
        <ModalFrame title="Meta de paneles" onClose={onClose}>
            <form className="grid gap-4 text-[var(--color-text-primary)]" onSubmit={handleSubmit}>
                
                {/* Mostrar el año y mes seleccionado */}
                

                {/* Mostrar el año y mes seleccionado */}
                <AddNumberField label="Meta anual de paneles" value={form.meta_paneles_anual} 
                    onChange={(value) => setForm((current) => ({ ...current, meta_paneles_anual: value }))} />
                <AddNumberField label="Meta mensual de paneles" value={form.meta_paneles_mensual} 
                    onChange={(value) => setForm((current) => ({ ...current, meta_paneles_mensual: value }))} />
                
                {error ? <p className="field-error">{error}</p> : null}
                
                <button className="btn-primary" type="submit" disabled={busy}>
                    {busy ? "Guardando…" : "Guardar meta"}
                </button>
            </form>
        </ModalFrame>
    );
}
