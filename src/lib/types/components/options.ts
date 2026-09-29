import { PROJECT_ANNUAL_HEADERS, PROJECT_MONTH_HEADERS } from "@/lib/utils/headers";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PROJECT_STATUS_OPTIONS, 
    SORTING_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";

export type MapStatus = "en_ejecucion" | "completado" | "sin_proyecto";

export type SystemType = (typeof SYSTEM_TYPE_OPTIONS)[number];
export type InverterBrand = (typeof INVERTER_BRAND_OPTIONS)[number];
export type DepartmentName = (typeof DEPARTMENT_OPTIONS)[number];
export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"];
export type ProjectSortingOrder = (typeof SORTING_OPTIONS)[number]["value"];

export type ProjectAnnualHeader = (typeof PROJECT_ANNUAL_HEADERS)[number];
export type ProjectMonthHeader = (typeof PROJECT_MONTH_HEADERS)[number];
