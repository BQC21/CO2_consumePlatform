import type { ReactNode, SelectHTMLAttributes } from "react";
import { Project, ProjectFormState } from "../supabase/project-types";
import { ProjectMonth, ProjectMonthFormState } from "../supabase/projectMonth-types";
import { ProjectSortingOrder } from "./options";

//--------
// Fields
//--------

export type FieldProps = {
    label: string;
    required?: boolean; 
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    step?: number | "";
    min?: number | "";
    max?: number | "";
    disabled?: boolean;
    centered?: boolean; // centra la etiqueta y el valor dentro del campo
};

export type SelectProps = FieldProps & {
    options: readonly string[];
    searchPlaceholder?: string;
    emptyMessage?: string;
};

export type NativeSelectProps = FieldProps & 
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
        options: SelectFieldOptions;
    };

export type SelectFieldOptions = readonly (string | SelectOption)[];

export type SelectOption = {
    value: string;
    label: string;
};

export type IconProps = { className?: string };

//--------
// Shells
//--------

export type ExcelWorkbookSheet = {
    id: string;
    label: string;
    content: ReactNode;
};

export type CollapsibleTableSectionProps = {
    title: string;
    meta?: string;
    children: ReactNode;
};

export type ExcelWorkbookProps = {
    sheets: ExcelWorkbookSheet[];
    defaultSheetId?: string;
    layout?: "split" | "tabs";
};

export type PortalShellProps = {
    title: string;
    subtitle: string;
    activePath: string;
    children: ReactNode;
    tone?: "light" | "dark";
    actions?: ReactNode;
};

//--------
// Images
//--------

export type LogoProps = {
    compact?: boolean;
};

export type PeruMapProps = {
    projects: Project[];
    selected: string | null;
    onSelect: (nombre: string) => void;
};

//--------
// Filters
//--------

export type ProjectFilters = {
    search: string;
    ubicacion: string;
    marcaInversor: string;
};

export type ProjectFiltersBarProps = {
    ubicacion: string;
    marcaInversor: string;
    onUbicacion: (value: string) => void;
    onMarca: (value: string) => void;
};

//--------
// Sorters
//--------

export type ProjectSorterProps = {
    value: ProjectSortingOrder;
    onChange: (value: ProjectSortingOrder) => void;
};

//--------
// Tables
//--------

export type ProjectAnnualTableProps = {
    projects: Project[];
    months: ProjectMonth[];
    total: number;
    onUpdate: (id: string, form: ProjectFormState) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
};

export type ProjectMonthTableProps = {
    projects: Project[];
    months: ProjectMonth[];
    onUpdate: (id: string, form: ProjectMonthFormState) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
};

//--------
// Modals
//--------

// Operaciones masivas
export type MassiveCleanModalProps = {
    title: string;
    description: string;
    onClean: () => Promise<void>;
    onClose: () => void;
};

export type MassiveDownloadModalProps = {
    title: string;
    filename: string;
    headers: string[];
    rows: string[][];
    onClose: () => void;
};

export type MassiveUploadModalProps = {
    title: string;
    description: string;
    expectedHeaders: readonly string[];
    onRows: (rows: Record<string, string>[]) => Promise<void>;
    onClose: () => void;
};

// GENERAL
export type ModalFrameProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

// Proyecto anual
export type AddProjectModalProps = {
    onAdd: (form: ProjectFormState) => Promise<void>;
    onClose: () => void;
};

export type DeleteProjectModalProps = {
    project: Project;
    onDelete: (id: string) => Promise<void>;
    onClose: () => void;
};

export type EditProjectModalProps = {
    project: Project;
    onUpdate: (form: ProjectFormState) => Promise<void>;
    onClose: () => void;
};

export type ProjectFormModalProps = {
    title: string;
    submitLabel: string;
    busyLabel: string;
    initial: ProjectFormState;
    onSubmit: (form: ProjectFormState) => Promise<void>;
    onClose: () => void;
};

// Proyecto mensual
export type AddMonthModalProps = {
    projects: Project[];
    onAdd: (form: ProjectMonthFormState) => Promise<void>;
    onClose: () => void;
};

export type DeleteMonthModalProps = {
    month: ProjectMonth;
    projectName: string;
    onDelete: (id: string) => Promise<void>;
    onClose: () => void;
};

export type EditMonthModalProps = {
    month: ProjectMonth;
    projects: Project[];
    onUpdate: (form: ProjectMonthFormState) => Promise<void>;
    onClose: () => void;
};

export type MonthFormModalProps = {
    title: string;
    initial: ProjectMonthFormState;
    projects: Project[];
    onSubmit: (form: ProjectMonthFormState) => Promise<void>;
    onClose: () => void;
};

//---------
// Botones
// --------

export type Button2AddProps = {
    label: string;
    children: (close: () => void) => ReactNode;
};

export type Button2DeleteProps = {
    label: string;
    children: (close: () => void) => ReactNode;
};

export type Button2EditProps = {
    label: string;
    children: (close: () => void) => ReactNode;
};

//-------------
// Adicionales
// ------------

// Contornos departamentales
export type DepartmentShape = {
    id: string;
    nombre: string;
    d: string;
    labelX: number;
    labelY: number;
};

// Energía mensual



// metricas para el dashboard
export type DashboardMetrics = {
    proyectosRegistrados: number;
    proyectosCompletados: number;
    capacidadInstaladaKwp: number;
    produccionMensualMwh: number;
    produccionAnualMwh: number;
};

// Tarjeta de la info de los proyectos por cada departamento
export type DepartmentCardProps = {
    department: string | null;
    projects: Project[];
};

// operaciones masivas
export type MassiveColumn = {
    header: string;
    field: string;
    kind: "text" | "number" | "integer" | "date" | "month";
    required?: boolean;
};