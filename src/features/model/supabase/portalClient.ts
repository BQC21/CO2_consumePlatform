import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

let portalClient: SupabaseClient | null = null;

/** Cliente anónimo del portal TEC. No reutiliza la sesión de esta plataforma. */
export function createPortalClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_PORTAL_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan las variables del portal TEC en el entorno.");
  }
  // CONEXIÓN CON EL PORTAL CORPORATIVO
  if (!portalClient) {
    portalClient = createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return portalClient;
}
