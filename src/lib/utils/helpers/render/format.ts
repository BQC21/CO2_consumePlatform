export function formatNumber(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  const fixed = value.toFixed(digits);
  const [whole, fraction] = fixed.split(".");
  const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${withThousands}.${fraction}` : withThousands;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) {
    return "—";
  }
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function formatMonthLabel(mes: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!match) {
    return mes || "—";
  }
  return `${match[2]}.${match[1]}`;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "TE";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

/** Meses que tienen registros o instalaciones en el año. Si no hay ninguno, ofrece los doce. */
export function monthsForYear(year: number, monthKeys: string[], installationDates: string[]): number[] {
  const found = new Set<number>();
  const add = (value: string) => {
    const match = new RegExp(`^${year}-(\\d{2})`).exec(value);
    if (!match) {
      return;
    }
    const month = Number(match[1]);
    if (month >= 1 && month <= 12) {
      found.add(month);
    }
  };
  monthKeys.forEach(add);
  installationDates.forEach(add);
  if (found.size === 0) {
    return Array.from({ length: 12 }, (_, index) => index + 1);
  }
  return [...found].sort((left, right) => left - right);
}