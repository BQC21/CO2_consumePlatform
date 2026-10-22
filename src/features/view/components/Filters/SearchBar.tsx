"use client";

import { SearchIcon } from "@/features/view/components/Icons/icons";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <label className="relative block w-200! max-w-full shrink-0">
      <span className="sr-only">Buscar</span>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-secondary)]">
        <SearchIcon />
      </span>
      <input className="field-input input-focus pl-9" value={value} placeholder={placeholder} 
              onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
