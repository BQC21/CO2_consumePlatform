"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/features/view/components/Images/Logo";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { PortalShellProps } from "@/lib/types/components/components";
import { NAVIGATION } from "@/lib/utils/consts/navigation";
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
  const [name, setName] = useState("Usuario");
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
      setName(fullName || user?.email || "Usuario");
      setEmail(user?.email ?? "");
    });
  }, []);

  async function handleSignOut() {
    if (hasSupabaseEnv()) {
      await createClient().auth.signOut();
    }
    window.location.href = "/login";
  }

  const shellStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgb(8 14 22 / 0.78), rgb(8 14 22 / 0.84)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed" as const,
      }
    : undefined;
  const shellClass = backgroundImage || tone !== "dark" ? "min-h-screen" : "dashboard-canvas min-h-screen";
  const showEmail = email !== "" && email !== name;

  return (
    <div className={shellClass} style={shellStyle}>
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-2 md:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5 text-[var(--color-text-primary)] no-underline">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden">
              <Logo compact />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold">TEC Energy Solutions</span>
              <span className="block text-[11px] text-[var(--color-text-secondary)]">PlatformCO2</span>
            </span>
          </Link>
          <nav className="flex flex-1 flex-wrap justify-center gap-2" aria-label="Principal">
            {NAVIGATION.map((item) => (
              <Link key={item.href} href={item.href} className={item.href === activePath ? "nav-pill nav-pill-active" : "nav-pill nav-pill-inactive"}>
                {item.label}
              </Link>
            ))}
          </nav>
          {headerCenter}
          <div className="relative flex items-center gap-2">
            <span className="hidden text-right leading-tight md:block">
              <span className="block text-sm font-semibold">{name}</span>
              {showEmail ? <span className="block text-[11px] text-[var(--color-text-secondary)]">{email}</span> : null}
            </span>
            <button
              type="button"
              className="grid place-items-center rounded-full text-xs font-semibold text-white"
              style={{ width: "var(--avatar-size)", height: "var(--avatar-size)", background: "var(--color-primary)" }}
              aria-label={`Cuenta de ${name}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {initialsFromName(name)}
            </button>
            {menuOpen ? (
              <button type="button" className="btn-secondary absolute top-12 right-0 z-20 h-10" onClick={() => void handleSignOut()}>
                Cerrar sesión
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex h-1">
          <span className="flex-1" style={{ background: "var(--color-primary)" }} />
          <span className="flex-1" style={{ background: "var(--color-accent-green)" }} />
          <span className="flex-1" style={{ background: "var(--color-secondary)" }} />
        </div>
      </header>
      <main className="px-4 py-6 lg:px-8" style={{ color: tone === "dark" ? "var(--color-text-on-dark)" : "var(--color-text-primary)" }}>
        {hideHeading ? null : (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold md:text-3xl" style={{ color: tone === "dark" ? "var(--color-text-on-dark)" : "var(--color-text-primary)" }}>
                {title}
                {titleBadge}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm" style={{ color: tone === "dark" ? "var(--color-text-on-dark-muted)" : "var(--color-text-secondary)" }}>
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
    </div>
  );
}
