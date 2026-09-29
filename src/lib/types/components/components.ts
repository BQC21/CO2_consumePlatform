import type { ReactNode } from "react";

export type FieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
};

export type ExcelWorkbookSheet = {
    id: string;
    label: string;
    content: ReactNode;
};

export type LogoProps = {
    compact?: boolean;
};

