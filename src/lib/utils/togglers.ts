import { ProjectStatus } from "../types/components/options";
import { ProjectOrigin } from "../types/supabase/project-types";

export function toStatus(value: string): ProjectStatus {
    return value === "completado" ? "completado" : "en_ejecucion";
}

export function toOrigin(value: string): ProjectOrigin {
    return value === "existente" ? "existente" : "independiente";
}