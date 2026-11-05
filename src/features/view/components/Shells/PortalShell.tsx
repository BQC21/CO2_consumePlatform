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
      <header className="sticky top-0 z-30 border-b border-[#e6e8ee] bg-white">
        <div className="flex min-h-[5.5rem] flex-wrap items-center gap-4 px-4 py-3 md:gap-8 md:px-8">
          <div className="w-48 shrink-0 sm:w-64 lg:w-80">
            <Logo fluid />
          </div>
          <span className="hidden h-14 w-px shrink-0 bg-[#d5d8e0] sm:block" aria-hidden="true" />
          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 md:gap-x-14" aria-label="Principal">
            {NAVIGATION.map((item) => {
              const active = item.href === activePath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xl font-medium no-underline md:text-2xl ${active ? "text-[var(--color-accent-green)]" : "text-[#1c2434] hover:text-[var(--color-accent-green)]"}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {headerCenter}
          <div className="relative flex min-w-0 shrink items-center gap-2">
            <span className="hidden min-w-0 max-w-[12rem] text-right leading-tight lg:block xl:max-w-[18rem]">
              <span className="block truncate text-base font-semibold lg:text-lg">{name}</span>
              {showEmail ? <span className="block truncate text-sm text-[var(--color-text-secondary)]">{email}</span> : null}
            </span>
            <button
              type="button"
              className="grid place-items-center rounded-full text-sm font-semibold text-white"
              style={{ width: "var(--avatar-size)", height: "var(--avatar-size)", background: "var(--color-primary)" }}
              aria-label={`Cuenta de ${name}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {initialsFromName(name)}
            </button>
            {menuOpen ? (
              <button type="button" className="btn-secondary absolute top-12 right-0 z-20 h-11 px-4 text-base" onClick={() => void handleSignOut()}>
                Cerrar sesión
              </button>
            ) : null}
          </div>
        </div>
      </header>
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
    </div>
  );
}
