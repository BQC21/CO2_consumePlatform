import { EMPTY_MARK } from "../empty";

export function isEmptyValue(value: unknown): boolean {
    return value === null || value === undefined || value === "";
}

export function displayOrEmpty(value: string | number | null | undefined): string {
    if (isEmptyValue(value)) {
        return EMPTY_MARK;
    }
    return String(value);
}
