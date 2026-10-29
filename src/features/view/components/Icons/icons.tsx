import { IconProps } from "@/lib/types/components/components";

// añadir
export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// editar
export function EditIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M9.2 2.8 13.2 6.8 5.5 14.5H1.5v-4L9.2 2.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// eliminar
export function TrashIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 4.5h10M6 4.5V3h4v1.5M4.2 4.5l.6 8.2h6.4l.6-8.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ordenar
export function SortIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 3v10M4 13 2 11M4 13l2-2M12 13V3M12 3 10 5M12 3l2 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// buscar
export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.2 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// gráficas
export function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 13.5V2.5M2 13.5h12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.5 10.5 7 7.2l2.2 2.1L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// cerrar ventana
export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// mostrar texto
export function EyeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1.5 8S4 4 8 4s6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

// ocultar texto
export function EyeSlashIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 3.5 14 12.5M3 6.2C4.2 4.6 6 3.8 8 3.8c3.6 0 6.2 4.2 6.2 4.2S13 10.2 11 11.4M6.2 12.1C5 11.6 3.8 10.4 2.8 8.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// subida masiva
export function UploadIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 11V3M5 6l3-3 3 3M3 13h10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// descarga masiva
export function DownloadIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3v8M5 8l3 3 3-3M3 13h10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// limpieza masiva
export function CleanIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M6 5l-2 3 2 3M10 5l2 3-2 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// icono de impacto ambiental
export function ImpactIcon({ name }: { name: "truck" | "factory" | "tree" | "bolt" }) {
  if (name === "truck") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="7" cy="17" r="1.4" fill="currentColor" />
        <circle cx="17" cy="17" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  if (name === "factory") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V10l5 3V10l5 3V8l6 3v8H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "tree") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 20v-6M12 14c-3 0-5-2-5-4.5S9 5 12 5s5 2 5 4.5S15 14 12 14Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}