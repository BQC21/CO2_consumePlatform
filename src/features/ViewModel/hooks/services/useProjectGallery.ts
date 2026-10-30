"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { addGalleryFile, getGalleries, removeGalleryFile, replaceGalleryFile, signedGalleryUrls } from "@/features/model/services/galleryQueries";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import type { ProjectGallery } from "@/lib/types/supabase/gallery-types";
import type { Project } from "@/lib/types/supabase/project-types";
import { MISSING_ENV } from "@/lib/utils/consts/messages";
import { GALLERY_TABLE } from "@/lib/utils/namingTolerance";

export function useProjectGallery() {
  const projectsState = useRealtimeProject();
  const [galleries, setGalleries] = useState<ProjectGallery[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [mediaLoading, setMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // carga de la galeria
  const loadMedia = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setGalleries([]);
      setUrls({});
      setMediaError(MISSING_ENV);
      setMediaLoading(false);
      return;
    }
    try {
      setMediaError(null);
      const rows = await getGalleries();
      const paths = rows.flatMap((row) => [...row.fotos, ...row.videos].map((item) => item.path));
      setGalleries(rows);
      setUrls(await signedGalleryUrls(paths));
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : "Error al cargar la galería");
    } finally {
      setMediaLoading(false);
    }
  }, []);

  // efecto para cargar la galeria cuando cambia el estado de los proyectos
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMedia();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadMedia]);

  // efecto para cargar la galeria cuando cambia el estado de la galeria
  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }
    const supabase = createClient();
    const channel = supabase
      .channel("galeria-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: GALLERY_TABLE }, () => {
        void loadMedia();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadMedia]);

  // mapeo de proyectos a la galeria
  const byProject = useMemo(() => {
    const map = new Map<string, ProjectGallery>();
    for (const row of galleries) {
      map.set(row.proyecto_id, row);
    }
    return map;
  }, [galleries]);

  // agregacion de archivos a la galeria
  const addFile = useCallback(async (project: Project, file: File, onProgress: (ratio: number) => void, signal?: AbortSignal) => {
    await addGalleryFile(project.id, project.nombre, file, onProgress, signal);
    await loadMedia();
  }, [loadMedia]);

  // reemplazo de archivos en la galeria
  const replaceFile = useCallback(async (project: Project, itemId: string, file: File, onProgress: (ratio: number) => void, signal?: AbortSignal) => {
    await replaceGalleryFile(project.id, project.nombre, itemId, file, onProgress, signal);
    await loadMedia();
  }, [loadMedia]);

  // eliminacion de archivos de la galeria
  const removeFile = useCallback(async (project: Project, itemId: string) => {
    await removeGalleryFile(project.id, project.nombre, itemId);
    await loadMedia();
  }, [loadMedia]);

  return {
    projects: projectsState.items,
    loading: projectsState.loading || mediaLoading,
    error: projectsState.error ?? mediaError,
    byProject,
    urls,
    addFile,
    replaceFile,
    removeFile,
  };
}
