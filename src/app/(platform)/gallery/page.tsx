"use client";

import { useMemo, useState } from "react";
import { AddGalleryContentModal } from "@/features/view/components/Gallery/AddGalleryContentModal";
import { GalleryContentModal } from "@/features/view/components/Gallery/GalleryContentModal";
import { GalleryGrid, GalleryGridSkeleton } from "@/features/view/components/Gallery/GalleryGrid";
import { GalleryToolbar } from "@/features/view/components/Gallery/GalleryToolbar";
import { RemoveGalleryItemModal } from "@/features/view/components/Gallery/RemoveGalleryItemModal";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useProjectGallery } from "@/features/ViewModel/hooks/services/useProjectGallery";
import type { GalleryMediaItem, GalleryMediaKind } from "@/lib/types/supabase/gallery-types";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import type { Project } from "@/lib/types/supabase/project-types";
import { GALLERY_SUBTITLE } from "@/lib/utils/consts/messages";
import { sortProjects } from "@/lib/utils/helpers/sorting/sortProjects";

type RemoveTarget = {
  project: Project;
  item: GalleryMediaItem;
  kind: GalleryMediaKind;
};

export default function GalleryPage() {
  const gallery = useProjectGallery();
  const [search, setSearch] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [sorting, setSorting] = useState<ProjectSortingOrder>("fecha_desc");
  const [opened, setOpened] = useState<Project | null>(null);
  const [adding, setAdding] = useState<Project | null>(null);
  const [replacing, setReplacing] = useState<{ project: Project; item: GalleryMediaItem } | null>(null);
  const [removing, setRemoving] = useState<RemoveTarget | null>(null);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matched = gallery.projects.filter((project) => {
      const matchesSearch = !query || project.nombre.toLowerCase().includes(query);
      const matchesDepartment = !ubicacion || project.ubicacion === ubicacion;
      return matchesSearch && matchesDepartment;
    });
    return sortProjects(matched, sorting);
  }, [gallery.projects, search, ubicacion, sorting]);

  const withoutMedia = visible.filter((project) => {
    const row = gallery.byProject.get(project.id);
    return !row || (row.fotos.length === 0 && row.videos.length === 0);
  }).length;

  function photosOf(project: Project): GalleryMediaItem[] {
    return gallery.byProject.get(project.id)?.fotos ?? [];
  }

  function videosOf(project: Project): GalleryMediaItem[] {
    return gallery.byProject.get(project.id)?.videos ?? [];
  }

  function coverUrl(project: Project): string {
    const photo = photosOf(project)[0];
    return photo ? gallery.urls[photo.path] ?? "" : "";
  }

  const openedPhotos = opened ? photosOf(opened) : [];
  const openedVideos = opened ? videosOf(opened) : [];

  return (
    <PortalShell
      title="Galería de proyectos"
      subtitle={GALLERY_SUBTITLE}
      activePath="/gallery"
    >
      <GalleryToolbar
        search={search}
        ubicacion={ubicacion}
        sorting={sorting}
        onSearch={setSearch}
        onUbicacion={setUbicacion}
        onSorting={setSorting}
      />
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        {visible.length} {visible.length === 1 ? "proyecto" : "proyectos"} · {withoutMedia} sin contenido
      </p>
      {gallery.loading ? <GalleryGridSkeleton /> : null}
      {!gallery.loading && gallery.error ? <p className="field-error">{gallery.error}</p> : null}
      {!gallery.loading && !gallery.error && visible.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Ningún proyecto coincide con la búsqueda.</p>
      ) : null}
      {!gallery.loading && !gallery.error && visible.length > 0 ? (
        <GalleryGrid
          projects={visible}
          photosOf={photosOf}
          videosOf={videosOf}
          coverUrl={coverUrl}
          onOpen={setOpened}
          onAdd={setAdding}
        />
      ) : null}
      {opened ? (
        <GalleryContentModal
          project={opened}
          photos={openedPhotos}
          videos={openedVideos}
          urlOf={(path) => gallery.urls[path] ?? ""}
          onAdd={() => setAdding(opened)}
          onReplace={(item) => setReplacing({ project: opened, item })}
          onRemove={(item) => {
            const kind = openedVideos.some((video) => video.id === item.id) ? "video" : "foto";
            setRemoving({ project: opened, item, kind });
          }}
          onClose={() => setOpened(null)}
        />
      ) : null}
      {adding ? (
        <AddGalleryContentModal
          projectName={adding.nombre}
          single={false}
          onUpload={(file, onProgress, signal) => gallery.addFile(adding, file, onProgress, signal)}
          onClose={() => setAdding(null)}
        />
      ) : null}
      {replacing ? (
        <AddGalleryContentModal
          projectName={replacing.project.nombre}
          single
          onUpload={(file, onProgress, signal) => gallery.replaceFile(replacing.project, replacing.item.id, file, onProgress, signal)}
          onClose={() => setReplacing(null)}
        />
      ) : null}
      {removing ? (
        <RemoveGalleryItemModal
          item={removing.item}
          kind={removing.kind}
          projectName={removing.project.nombre}
          url={gallery.urls[removing.item.path] ?? ""}
          onConfirm={() => gallery.removeFile(removing.project, removing.item.id)}
          onClose={() => setRemoving(null)}
        />
      ) : null}
    </PortalShell>
  );
}
