import { GalleryMediaKind } from "@/lib/types/components/options";

export const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime"]);
export const EXTENSION_KIND: Record<string, GalleryMediaKind> = {
    jpg: "foto",
    jpeg: "foto",
    png: "foto",
    webp: "foto",
    mp4: "video",
    mov: "video",
};

export const GALLERY_FILE_ACCEPT = "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,.jpg,.jpeg,.png,.webp,.mp4,.mov";