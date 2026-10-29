"use server";

import { createHash, timingSafeEqual } from "node:crypto";

/** Genera un hash SHA-256 de la contraseña. */
function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Compara la contraseña escrita con MASSIVE_CLEAN_PASSWORD sin exponerla al navegador. */
export async function verifyMassiveCleanPassword(password: string): Promise<boolean> {
  const expected = process.env.MASSIVE_CLEAN_PASSWORD;
  if (!expected) {
    throw new Error("La contraseña de confirmación no está configurada.");
  }
  return timingSafeEqual(digest(password), digest(expected));
}
