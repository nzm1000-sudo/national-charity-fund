import { randomUUID, randomBytes } from "node:crypto";

/** URL-safe, human-friendly public id for donations. */
export function donationPublicId(): string {
  return `D-${Date.now().toString(36).toUpperCase()}-${randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

/** Short slug / code for QR targets. */
export function shortCode(length = 7): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export function uuid(): string {
  return randomUUID();
}
