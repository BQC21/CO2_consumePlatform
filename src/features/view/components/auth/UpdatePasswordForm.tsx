"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";

export function UpdatePasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasSupabaseEnv()) {
      setError("Faltan las variables de Supabase.");
      return;
    }
    setBusy(true);
    setError("");

    const redirectTo = `${window.location.origin}/callback?next=/save_password`;
    const { error: authError } = await createClient().auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);

    if (authError) {
      setError("No se pudo enviar el enlace. Confirma que el correo esté registrado.");
      return;
    }

    setMessage("Si el correo existe, recibirás el enlace para elegir una contraseña nueva.");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label>
        <span className="field-label">Correo corporativo</span>
        <input className="field-input input-focus-brand" 
              type="email" value={email} 
              onChange={(event) => setEmail(event.target.value)} />
      </label>

      {error ? <p className="field-error">{error}</p> : null}
      {message ? <p className="text-sm">{message}</p> : null}
      
      <button className="btn-primary w-full" 
              type="submit" disabled={busy}>
        {busy ? "Enviando…" : "Enviar enlace"}
      </button>

      <Link href="/login" className="text-center text-sm" 
            style={{ color: "var(--color-secondary)" }}>
        Volver al ingreso
      </Link>
    </form>
  );
}
