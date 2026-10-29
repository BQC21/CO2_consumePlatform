import { MONTH_SHORT } from "../../consts/monthNames";

// span de meses
export function monthSpan(year: number, values: number[], allYears: boolean): string {
  if (allYears) {
    return "TODOS";
  }
  const present = values.flatMap((value, index) => (value > 0 ? [index] : []));
  if (present.length === 0) {
    return String(year);
  }
  const start = MONTH_SHORT[present[0]].toUpperCase();
  const end = MONTH_SHORT[present[present.length - 1]].toUpperCase();
  return start === end ? `${start} ${year}` : `${start} – ${end} ${year}`;
}
  