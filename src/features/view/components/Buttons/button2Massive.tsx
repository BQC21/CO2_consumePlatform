"use client";

import { useState, type ReactNode } from "react";
import { UploadIcon, DownloadIcon, CleanIcon } from "@/features/view/components/Icons/icons";

function MassiveButton({ label, icon, children }: { label: string; icon: ReactNode; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-secondary" onClick={() => setOpen(true)}>
        {icon}
        <span>{label}</span>
      </button>
      {open ? children(() => setOpen(false)) : null}
    </>
  );
}

export function Button2MassiveUpload({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  return (
    <MassiveButton label={label} icon={<UploadIcon />}>
      {children}
    </MassiveButton>
  );
}

export function Button2MassiveDownload({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  return (
    <MassiveButton label={label} icon={<DownloadIcon />}>
      {children}
    </MassiveButton>
  );
}

export function Button2MassiveClean({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  return (
    <MassiveButton label={label} icon={<CleanIcon />}>
      {children}
    </MassiveButton>
  );
}
