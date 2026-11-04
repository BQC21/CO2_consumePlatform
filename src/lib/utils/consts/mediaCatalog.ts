import { ProjectMedia } from "@/lib/types/components/components";

// Algunos navegadores no admiten lectura de archivos en formato .heic
export const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
export const VIDEO_EXTENSIONS = new Set(["mp4", "webm"]);

// Tarjeta de departamentos
export const PROJECT_MEDIA: readonly ProjectMedia[] = [
  { aliases: ["Familia Castillo Salazar"], files: [] },
  { aliases: ["Artesco"], files: [] },
  { aliases: ["Killa"], files: [] },
  {
    aliases: ["Ribera del Ríos", "Cieneguilla"],
    files: ["/Proyectos/Cieneguilla/DJI_0107.jpg", "/Proyectos/Cieneguilla/_DSC3665.jpg"],
  },
  {
    aliases: ["Quilmaná", "Quilmana"],
    files: ["/Proyectos/Quilmana/_DSC4491.jpg", "/Proyectos/Quilmana/_DSC4577.jpg"],
  },
  { aliases: ["Algarrobos"], files: [] },
  {
    aliases: ["Honda"],
    files: ["/Proyectos/Loreto/EDIT IQUITOS (3).jpg", "/Proyectos/Loreto/TEC WEB (3).jpg"],
  },
  {
    aliases: ["CENTRIKA", "Centrika"],
    files: ["/Proyectos/Centrika/1 (1).jpg", "/Proyectos/Centrika/WhatsApp Image 2025-11-06 at 10.33.00 PM.jpeg"],
  },
  {
    aliases: ["Caja los Andes"],
    files: ["/Proyectos/Puno/instalacion-puno-edit.jpg", "/Proyectos/Puno/EQUIPO TÉCNICO (13).jpg"],
  },
  {
    aliases: ["Laguna Seca", "Laguna SECA"],
    files: ["/Proyectos/Cajamarca/LAGUNA SECA- TEC (26).jpg", "/Proyectos/Cajamarca/LAGUNA SECA- TEC (61).jpg"],
  },
  {
    aliases: ["La Floresta", "San Borja"],
    files: ["/Proyectos/SanBorja/DJI_20250912113552_0046_D.jpg", "/Proyectos/SanBorja/_DSC8408.jpg"],
  },
  {
    aliases: ["Cafetero", "Satipo"],
    files: ["/Proyectos/Junin/TEC V2 (1).jpg", "/Proyectos/Junin/TEC V2 (6).jpg"],
  },
];

// Tarjeta Expoferia 2026
export const EXPOFERIA_2026_IMAGES: readonly string[] = ["/Ferias/Expoferia2026/_DSC4626.jpg"];