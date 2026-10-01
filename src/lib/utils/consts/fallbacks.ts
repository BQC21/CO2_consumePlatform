import { Meta } from "@/lib/types/supabase/meta-types";

// backup de la información para la meta

export const fallbackMeta = (): Meta => ({
    id: "",
    anio: new Date().getFullYear(),
    mes: String(new Date().getMonth() + 1).padStart(2, "0"),
    meta_paneles_anual: 1000,
    meta_paneles_mensual: 100,
});

