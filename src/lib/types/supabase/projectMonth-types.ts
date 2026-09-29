/** Fila de `registros_mensuales`. */
export type SupabaseProjectMonthRow = {
    id?: string;
    proyecto_id: string | null;
    mes: string | null;
    tipico_diario: number | string | null;
    pot_nominal_kw: number | string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ProjectMonth = {
    id: string;
    proyecto_id: string;
    mes: string;
    tipico_diario: number;
    pot_nominal_kw: number | null;
    updated_at: string;
};

export type ProjectMonthFormState = {
    proyecto_id: string;
    mes: string;
    tipico_diario: string;
    pot_nominal_kw: string;
};

export type ProjectMonthFormData = ProjectMonthFormState;

