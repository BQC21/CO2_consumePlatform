"use client";

import { useState } from "react";

type ExcelCellProps = {
  value: string;
  kind: "editable" | "calculated" | "locked" | "text";
  ariaLabel: string;
  onCommit?: (value: string) => void;
  options?: readonly string[];
};

export function ExcelCell({ value, kind, ariaLabel, onCommit, options }: ExcelCellProps) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  const className =
    kind === "calculated"
      ? "excel-cell excel-calculated numeric"
      : kind === "locked"
        ? "excel-cell excel-locked"
        : kind === "editable"
          ? "excel-cell excel-editable"
          : "excel-cell";

  if (!focused && draft !== value) {
    setDraft(value);
  }

  if (kind !== "editable" || !onCommit) {
    return <span className={className}>{value || "—"}</span>;
  }

  if (options) {
    const listId = `excel-${ariaLabel.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <>
        <input
          className={className}
          aria-label={ariaLabel}
          list={listId}
          value={draft}
          onFocus={() => setFocused(true)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            setFocused(false);
            if (draft !== value) {
              onCommit(draft);
            }
          }}
        />
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </>
    );
  }

  return (
    <input
      className={className}
      aria-label={ariaLabel}
      value={draft}
      onFocus={() => setFocused(true)}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        setFocused(false);
        if (draft !== value) {
          onCommit(draft);
        }
      }}
    />
  );
}
