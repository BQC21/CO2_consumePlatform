/** Fila de `metas`. */
export type SupabaseMetaRow = {
    id?: string;
    anio: number | string | null;
    meta_paneles_anual: number | string | null;
    meta_paneles_mensual: number | string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type Meta = {
    id: string;
    anio: number;
    meta_paneles_anual: number;
    meta_paneles_mensual: number;
};

export type MetaFormState = {
    anio: string;
    meta_paneles_anual: string;
    meta_paneles_mensual: string;
};

export type MetaFormData = MetaFormState;