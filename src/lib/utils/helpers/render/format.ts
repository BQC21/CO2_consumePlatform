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
