import type { ProjectMedia } from "@/lib/types/components/components";

// Algunos navegadores no admiten lectura de archivos en formato .heic
export const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
export const VIDEO_EXTENSIONS = new Set(["mp4", "webm"]);

// Carrusel del dashboard. El botón 1 muestra la primera foto, y así en orden.
export const HERO_SLIDES = [
  "/Hero/PORTADA1.jpg",
  "/Hero/PORTADA2.jpg",
  "/Hero/PORTADA3.jpg",
  "/Hero/PORTADA4.jpg",
  "/Hero/PORTADA5.jpg",
  "/Hero/PORTADA6.jpg",
] as const;

// Carpeta dentro de public. Las fotos no se listan aquí: mediaForProject las lee de la carpeta.
export const PROJECT_MEDIA: readonly Pick<ProjectMedia, "aliases" | "folder">[] = [
  { aliases: ["Familia Castillo Salazar"], folder: "/Proyectos/Castillo" },
  { aliases: ["Artesco"], folder: "/Proyectos/Artesco" },
  { aliases: ["Killa"], folder: "/Proyectos/Killa" },
  { aliases: ["Ribera del Ríos", "Cieneguilla"], folder: "/Proyectos/Cieneguilla" },
  { aliases: ["Quilmaná", "Quilmana"], folder: "/Proyectos/Quilmana" },
  { aliases: ["Algarrobos"], folder: "/Proyectos/Algarrobos" },
  { aliases: ["Honda"], folder: "/Proyectos/Loreto" },
  { aliases: ["CENTRIKA", "Centrika"], folder: "/Proyectos/Centrika" },
  { aliases: ["Caja los Andes"], folder: "/Proyectos/Puno" },
  { aliases: ["Laguna Seca", "Laguna SECA"], folder: "/Proyectos/Cajamarca" },
  { aliases: ["La Floresta", "San Borja"], folder: "/Proyectos/SanBorja" },
  { aliases: ["Cafetero", "Satipo"], folder: "/Proyectos/Junin" },
];

// Ferias y eventos
export const EVENTS = [
  {
    title: "ExpoEnergética 2026",
    cover: "/expoEnergetica.jpeg",
    folder: "/Ferias/Expoferia2026",
  },
  {
    title: "ExpoSolar 2026",
    cover: "/ExpoSolar.png",
    folder: "/Ferias/ExpoSolar2026",
  },
] as const;