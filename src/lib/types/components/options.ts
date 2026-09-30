import { PROJECT_ANNUAL_HEADERS, PROJECT_MONTH_HEADERS } from "@/lib/utils/headers";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PROJECT_STATUS_OPTIONS, 
    SORTING_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";

// estados de los proyectos a visualizarse en el mapa
export type MapStatus = "en_ejecucion" | "completado" | "sin_proyecto";


export type SystemType = (typeof SYSTEM_TYPE_OPTIONS)[number]; // tipo del sistema
export type InverterBrand = (typeof INVERTER_BRAND_OPTIONS)[number]; // marca del inversor
export type DepartmentName = (typeof DEPARTMENT_OPTIONS)[number]; // nombre del departamento
export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"]; // estado del proyecto
export type ProjectSortingOrder = (typeof SORTING_OPTIONS)[number]["value"]; // opciones de ordenamiento

export type ProjectAnnualHeader = (typeof PROJECT_ANNUAL_HEADERS)[number]; // encabezado de la vista anual del proyecto
export type ProjectMonthHeader = (typeof PROJECT_MONTH_HEADERS)[number]; // encabezado de la vista mensual del proyecto
