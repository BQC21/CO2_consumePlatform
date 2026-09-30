/** Fila de `registros_mensuales`. */
export type SupabaseProjectMonthRow = {
    id?: string;
    proyecto_id: string | null;
    mes: string | null;
    rendimiento_fv: number | string | null;
    rendimiento_grid: number | string | null;
    reduccion_co2: number | string | null;
    reduccion_carbon: number | string | null;
    arboles: number | string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ProjectMonth = {
    id: string;
    proyecto_id: string;
    mes: string;
    rendimiento_fv: number | null;
    rendimiento_grid: number | null;
    reduccion_co2: number | null;
    reduccion_carbon: number | null;
    arboles: number | null;
    updated_at: string;
};

export type ProjectMonthFormState = {
    proyecto_id: string;
    mes: string;
    rendimiento_fv: string;
    rendimiento_grid: string;
    reduccion_co2: string;
    reduccion_carbon: string;
    arboles: string;
};

export type ProjectMonthFormData = ProjectMonthFormState;

