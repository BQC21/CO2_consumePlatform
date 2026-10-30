"use client";

import { useMemo, useState, type ReactNode } from "react";
import { PlayIcon, PlusIcon, ReplaceIcon, TrashIcon } from "@/features/view/components/Icons/icons";
import { galleryMediaGridClass, GALLERY_PREVIEW_COUNT } from "@/lib/utils/consts/galleryLayout";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import type { GalleryMediaItem } from "@/lib/types/supabase/gallery-types";
import type { Project } from "@/lib/types/supabase/project-types";
import { GALLERY_EMPTY_BODY, GALLERY_EMPTY_TITLE, GALLERY_HOVER_HINT } from "@/lib/utils/consts/messages";
import { formatGalleryPower } from "@/lib/utils/helpers/render/format";
import { GalleryMediaFilter, GalleryMediaKind } from "@/lib/types/components/options";

export function GalleryContentModal({
  project,
  photos,
  videos,
  urlOf,
  onAdd,
  onReplace,
  onRemove,
  onClose,
}: {
  project: Project;
  photos: GalleryMediaItem[];
  videos: GalleryMediaItem[];
  urlOf: (path: string) => string;
  onAdd: () => void;
  onReplace: (item: GalleryMediaItem) => void;
  onRemove: (item: GalleryMediaItem) => void;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<GalleryMediaFilter>("todo");
  const [visible, setVisible] = useState(GALLERY_PREVIEW_COUNT);

  const items = useMemo(() => {
    const tagged = [
      ...photos.map((item) => ({ item, kind: "foto" as const })),
      ...videos.map((item) => ({ item, kind: "video" as const })),
    ];
    if (filter === "todo") {
      return tagged;
    }
    return tagged.filter((entry) => entry.kind === filter);
  }, [filter, photos, videos]);

  const shown = items.slice(0, visible);
  const place = [project.distrito, project.ubicacion].filter(Boolean).join(", ");
  const power = formatGalleryPower(project.cap_instalada_kwp ?? project.pot_nominal_kw);
  const summary = [place, project.tipo_de_sistema, power, countLabel(photos.length, "foto", "fotos"), countLabel(videos.length, "video", "videos")]
    .filter(Boolean)
    .join(" · ");

  function chooseFilter(next: GalleryMediaFilter) {
    setFilter(next);
    setVisible(GALLERY_PREVIEW_COUNT);
  }

  return (
    <ModalFrame
      title={`${project.nombre} · Galería`}
      onClose={onClose}
      wide
      headerExtra={
        <button type="button" className="btn-primary btn-compact" onClick={onAdd}>
          <PlusIcon />
          Añadir contenido
        </button>
      }
    >
      <p className="-mt-2 mb-4 text-sm text-[var(--color-text-secondary)]">{summary}</p>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist" aria-label="Tipo de contenido">
          <FilterPill active={filter === "todo"} onClick={() => chooseFilter("todo")}>
            Todo ({photos.length + videos.length})
          </FilterPill>
          <FilterPill active={filter === "foto"} onClick={() => chooseFilter("foto")}>
            Fotos ({photos.length})
          </FilterPill>
          <FilterPill active={filter === "video"} onClick={() => chooseFilter("video")}>
            Videos ({videos.length})
          </FilterPill>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">{GALLERY_HOVER_HINT}</p>
      </div>
      {items.length === 0 ? (
        <div className="grid min-h-40 place-items-center rounded-2xl bg-[var(--color-surface-muted)] px-4 text-center">
          <div>
            <p className="font-semibold">{GALLERY_EMPTY_TITLE}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{GALLERY_EMPTY_BODY}</p>
          </div>
        </div>
      ) : (
        <div className={galleryMediaGridClass}>
          {shown.map(({ item, kind }) => (
            <MediaTile
              key={item.id}
              item={item}
              kind={kind}
              url={urlOf(item.path)}
              onReplace={() => onReplace(item)}
              onRemove={() => onRemove(item)}
            />
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Mostrando {Math.min(visible, items.length)} de {items.length}
          {visible < items.length ? (
            <>
              {" · "}
              <button type="button" className="font-semibold text-[var(--color-secondary)]" onClick={() => setVisible((count) => count + GALLERY_PREVIEW_COUNT)}>
                Ver más
              </button>
            </>
          ) : null}
        </p>
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </ModalFrame>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={active ? "nav-pill nav-pill-active" : "nav-pill nav-pill-inactive"}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function MediaTile({
  item,
  kind,
  url,
  onReplace,
  onRemove,
}: {
  item: GalleryMediaItem;
  kind: GalleryMediaKind;
  url: string;
  onReplace: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-[var(--color-surface-muted)]">
      {url && kind === "foto" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={item.nombre} className="aspect-[4/3] w-full object-cover" />
      ) : url ? (
        <video src={url} className="aspect-[4/3] w-full object-cover" preload="metadata" />
      ) : (
        <div className="grid aspect-[4/3] place-items-center text-xs text-[var(--color-text-secondary)]">Sin vista previa</div>
      )}
      {kind === "video" ? (
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-white">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black/55">
            <PlayIcon />
          </span>
          {item.duracion ? <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px]">{item.duracion}</span> : null}
        </span>
      ) : null}
      <span className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <button type="button" className="icon-button bg-white text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]" aria-label={`Reemplazar ${item.nombre}`} onClick={onReplace}>
          <ReplaceIcon />
        </button>
        <button type="button" className="icon-button bg-white text-[var(--color-error)] shadow-[var(--shadow-sm)]" aria-label={`Quitar ${item.nombre}`} onClick={onRemove}>
          <TrashIcon />
        </button>
      </span>
    </div>
  );
}

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
