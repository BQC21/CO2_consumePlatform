"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/features/view/components/Images/Logo";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { PortalShellProps } from "@/lib/types/components/components";
import { NAVIGATION } from "@/lib/utils/consts/navigation";
import { getSessionDisplayName } from "@/lib/utils/helpers/auth/portalDisplayName";
import { initialsFromName } from "@/lib/utils/helpers/normalization";

export function PortalShell({
  title,
  subtitle,
  activePath,
  children,
  tone = "light",
  actions,
  headerExtra,
  headerCenter,
  titleBadge,
  hideHeading = false,
  backgroundImage,
}: PortalShellProps) {

  // -------------------
  // ----- Estados -----
  // ------------------- 

  const [name, setName] = useState("Usuario"); // nombre de usuario
  const [email, setEmail] = useState(""); // correo electrónico
  const [signOutOpen, setSignOutOpen] = useState(false); // Ventana de la salida de sesión
  const [signingOut, setSigningOut] = useState(false); // salida de sesión confirmada

  // --------------------
  // -- Sincronización --
  // --------------------

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }
    const supabase = createClient(); 
    void supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
      const emailAddress = user?.email ?? "";
      let mappedName: string | null = null;
      try {
        mappedName = await getSessionDisplayName();
      } catch {
        mappedName = null;
      }
      setName(mappedName || fullName || emailAddress || "Usuario");
      setEmail(mappedName ? "" : emailAddress);
    });
  }, []);

  // -------------------
  // ---- Handlers -----
  // ------------------- 

  // Para la ventana de confirmación
  const closeSignOut = useCallback(() => {
    if (signingOut) {
      return;
    }
    setSignOutOpen(false);
  }, [signingOut]);

  // Manipular salida de sesión del usuario
  async function handleSignOut() {
    setSigningOut(true);
    try {
      if (hasSupabaseEnv()) {
        await createClient().auth.signOut();
      }
      window.location.href = "/login";
    } catch {
      setSigningOut(false);
    }
  }

  // -------------------
  // -- Estilización ---
  // ------------------- 

  const shellStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgb(8 14 22 / 0.78), rgb(8 14 22 / 0.84)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed" as const,
      }
    : undefined;
  const shellClass = backgroundImage || tone !== "dark" ? "min-h-screen" : "dashboard-canvas min-h-screen";

  return (
    <div className={shellClass} style={shellStyle}>

      {/* HEADER DE LA SHELL */}
      <header className="sticky top-0 z-30 border-b border-[#e6e8ee] bg-white">
        <div className="flex min-h-[5.5rem] flex-wrap items-center gap-4 px-4 py-3 md:gap-8 md:px-8">
          {/* LOGO DE LA SHELL */}
          <div className="w-48 shrink-0 sm:w-64 lg:w-80">
            <Logo fluid />
          </div>
          <span className="hidden h-14 w-px shrink-0 bg-[#d5d8e0] sm:block" aria-hidden="true" />

          {/* NAVEGACIÓN DE LA SHELL */}
          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 md:gap-x-14" aria-label="Principal">
            {NAVIGATION.map((item) => {
              const active = item.href === activePath; // Indica si la página actual es la misma que la navegación.
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-display text-xl font-medium no-underline md:text-2xl ${active ? "text-[var(--color-secondary)]" : "text-[var(--color-text-primary)] hover:text-[var(--color-secondary)]"}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CENTRO DEL HEADER */}
          {headerCenter}

          {/* CUENTA DE USUARIO */}
          <div className="flex min-w-0 shrink items-center gap-2">

            {/* NOMBRE DE USUARIO */}
            <span className="hidden min-w-0 max-w-[12rem] text-right leading-tight lg:block xl:max-w-[18rem]">
              <span className="block truncate text-base font-semibold lg:text-lg">{name}</span>
            </span>

            {/* ÍCONO DE LA CUENTA */}
            <span
              className="grid place-items-center rounded-full text-sm font-semibold text-[var(--color-text-on-primary)]"
              style={{ width: "var(--avatar-size)", height: "var(--avatar-size)", background: "var(--color-primary)" }}
              aria-hidden="true"
            >
              {initialsFromName(name)}
            </span>

            {/* SALIR DE LA CUENTA */}
            <button type="button" className="btn-secondary btn-compact" aria-label={`Salir de la cuenta de ${name}`} onClick={() => setSignOutOpen(true)}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO DE LA SHELL */}
      <main className="px-4 py-6 lg:px-8" style={{ color: tone === "dark" ? "var(--color-text-on-dark)" : "var(--color-text-primary)" }}>
        {hideHeading ? null : (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold md:text-4xl" style={{ color: tone === "dark" ? "var(--color-text-on-dark)" : "var(--color-text-primary)" }}>
                {title}
                {titleBadge}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-base md:text-lg" style={{ color: tone === "dark" ? "var(--color-text-on-dark-muted)" : "var(--color-text-secondary)" }}>
                  {subtitle}
                </p>
              ) : null}
            </div>
            {headerExtra ? <div className="min-w-[min(100%,32rem)] flex-1">{headerExtra}</div> : null}
            {actions}
          </div>
        )}
        {children}
      </main>

      {signOutOpen ? (
        <ModalFrame title="Cerrar sesión" onClose={closeSignOut}>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSignOut();
            }}
          >
            <p>
              ¿Deseas salir de la cuenta de <strong>{name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={closeSignOut} disabled={signingOut}>
                Cancelar
              </button>
              <button type="submit" className="btn-danger" disabled={signingOut}>
                {signingOut ? "Cerrando…" : "Cerrar sesión"}
              </button>
            </div>
          </form>
        </ModalFrame>
      ) : null}
    </div>
  );
}
