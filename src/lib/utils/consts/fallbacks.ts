import { Meta } from "@/lib/types/supabase/meta-types";

export const fallbackMeta = (): Meta => ({
    id: "",
    anio: new Date().getFullYear(),
    meta_paneles_anual: 1000,
    meta_paneles_mensual: 100,
});
