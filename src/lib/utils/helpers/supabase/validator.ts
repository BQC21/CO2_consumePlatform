// Valida si existe credenciales para el portal corporativo
export function hasPortalEnv(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL && process.env.NEXT_PUBLIC_PORTAL_SUPABASE_PUBLISHABLE_KEY);
}