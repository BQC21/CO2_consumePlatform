"use client";

import { MediaIcon } from "@/features/view/components/Icons/icons";
import { galleryGridClass } from "@/lib/utils/consts/galleryLayout";
import type { GalleryMediaItem } from "@/lib/types/supabase/gallery-types";
import type { Project } from "@/lib/types/supabase/project-types";
import { GALLERY_EMPTY_BODY, GALLERY_EMPTY_TITLE } from "@/lib/utils/consts/messages";
import { formatGalleryInstallation, formatGalleryUpdated } from "@/lib/utils/helpers/render/format";

// Etiqueta de conteo de media
function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function GalleryGrid({
  projects,
  photosOf,
  videosOf,
  coverUrl,
  onOpen,
  onAdd,
}: {
  projects: Project[];
  photosOf: (project: Project) => GalleryMediaItem[];
  videosOf: (project: Project) => GalleryMediaItem[];
  coverUrl: (project: Project) => string;
  onOpen: (project: Project) => void;
  onAdd: (project: Project) => void;
}) {
  return (
    <div className={galleryGridClass}>
      {projects.map((project) => {
        const photos = photosOf(project);
        const videos = videosOf(project);
        const empty = photos.length === 0 && videos.length === 0;
        const place = [project.distrito, project.ubicacion].filter(Boolean).join(", ");
        return (
          <article key={project.id} className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-white shadow-[var(--shadow-sm)]">
            <button type="button" className="block w-full text-left" onClick={() => onOpen(project)}>
              {empty ? (
                <span className="grid min-h-44 place-items-center bg-[var(--color-surface-muted)] px-4 text-center text-[var(--color-text-secondary)]">
                  <span>
                    <MediaIcon className="mx-auto text-[var(--color-secondary)]" />
                    <span className="mt-2 block text-sm font-semibold text-[var(--color-text-primary)]">{GALLERY_EMPTY_TITLE}</span>
                    <span className="mt-1 block text-xs">{GALLERY_EMPTY_BODY}</span>
                  </span>
                </span>
              ) : (
                <span className="relative block min-h-44 bg-[var(--color-surface-muted)]">
                  {coverUrl(project) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverUrl(project)} alt="" className="h-44 w-full object-cover" />
                  ) : (
                    <span className="grid h-44 place-items-center text-[var(--color-text-secondary)]">
                      <MediaIcon />
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 flex gap-2">
                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">{countLabel(photos.length, "foto", "fotos")}</span>
                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">{countLabel(videos.length, "video", "videos")}</span>
                  </span>
                </span>
              )}
              <span className="block px-4 pt-3">
                <span className="block font-semibold text-[var(--color-text-primary)]">{project.nombre}</span>
                <span className="mt-0.5 block text-sm text-[var(--color-text-secondary)]">{place || "Sin ubicación"}</span>
                <span className="mt-2 block text-sm text-[var(--color-text-primary)]">{formatGalleryInstallation(project.fecha_instalacion)}</span>
                <span className="mt-0.5 block text-xs text-[var(--color-text-secondary)]">{formatGalleryUpdated(project.updated_at)}</span>
              </span>
            </button>
            {empty ? (
              <button type="button" className="px-4 pt-2 pb-4 text-sm font-semibold text-[var(--color-secondary)]" onClick={() => onAdd(project)}>
                + Añadir contenido
              </button>
            ) : (
              <span className="block h-4" />
            )}
          </article>
        );
      })}
    </div>
  );
}