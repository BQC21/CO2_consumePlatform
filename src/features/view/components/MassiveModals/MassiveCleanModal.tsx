"use client";

import { useState } from "react";
import { verifyMassiveCleanPassword } from "@/lib/utils/helpers/passwords/massiveCleanPassword";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { MassiveCleanModalProps } from "@/lib/types/components/components";

export function MassiveCleanModal({ title, description, onClean, onClose }: MassiveCleanModalProps) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Acción de abrir contraseña al hacer click en "vaciar tabla"
  function openPassword() {
    setPassword("");
    setError("");
    setConfirming(true);
  }

  // Acción para salir de la ventana de contraseña
  function backToWarning() {
    if (busy) {
      return;
    }
    setPassword("");
    setError("");
    setConfirming(false);
  }

  // Manipular confirmación
  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim()) {
      setError("Ingresa la contraseña.");
      return;
    }
    setBusy(true);
    setError("");

    // Se ha ingresado la contraseña
    try {
      const valid = await verifyMassiveCleanPassword(password);
      if (!valid) {
        setError("La contraseña no coincide.");
        setBusy(false);
        return;
      }
      await onClean();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo limpiar la tabla.");
      setBusy(false);
    }
  }

  // renderizado opcional en caso se haya optado por vaciar la tabla
  if (confirming) {
    return (
      <ModalFrame title="Confirmar vaciado" onClose={backToWarning}>
        <form className="grid gap-4" onSubmit={handleConfirm}>
          <p>Ingresa la contraseña para vaciar la tabla.</p>
          <label className="block">
            <span className="field-label">Contraseña</span>
            <input
              className="field-input input-focus"
              type="password"
              autoComplete="current-password"
              value={password}
              aria-label="Contraseña de confirmación"
              aria-invalid={Boolean(error)}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
          </label>
          {error ? <p className="field-error">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={backToWarning} disabled={busy}>
              Cancelar
            </button>
            <button type="submit" className="btn-danger" disabled={busy}>
              {busy ? "Confirmando…" : "Confirmar"}
            </button>
          </div>
        </form>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame title={title} onClose={onClose}>
      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <p>{description}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={openPassword}>
            Vaciar tabla
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
