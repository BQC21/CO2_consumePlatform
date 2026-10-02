/** Fila de `registros_mensuales`. */
export type SupabaseProjectMonthRow = {
    id?: string;
    proyecto_id: string | null;
    mes: string | null;
    rendimiento_fv: number | string | null;
    rendimiento_grid: number | string | null;
    consumo_carga: number | string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ProjectMonth = {
    id: string;
    proyecto_id: string;
    mes: string;
    rendimiento_fv: number | null;
    rendimiento_grid: number | null;
    consumo_carga: number | null;
    updated_at: string;
};

export type ProjectMonthFormState = {
    proyecto_id: string;
    mes: string;
    rendimiento_fv: string;
    rendimiento_grid: string;
    consumo_carga: string;
};

export type ProjectMonthFormData = ProjectMonthFormState;

