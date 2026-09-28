import type { ReactNode } from "react";

export type ExcelWorkbookSheet = {
  id: string;
  label: string;
  content: ReactNode;
};
