"use server";

import { createClient } from "@/features/model/supabase/server";

/** "correo=Nombre visible;otro@dominio.com=Otro nombre" */
function displayNameForEmail(raw: string, email: string): string | null {
  const target = email.trim().toLowerCase();
  if (!target) {
    return null;
  }
  for (const pair of raw.split(";")) {
    const separator = pair.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const key = pair.slice(0, separator).trim().toLowerCase();
    const name = pair.slice(separator + 1).trim();
    if (key === target && name) {
      return name;
    }
  }
  return null;
}

/** Nombre visible del usuario en sesión. El mapa vive solo en el servidor. */
export async function getSessionDisplayName(): Promise<string | null> {
  const raw = process.env.PORTAL_USER_DISPLAY_NAMES ?? ""; 
  if (!raw.trim()) {
    return null;
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (!email) {
    return null;
  }
  return displayNameForEmail(raw, email);
}
