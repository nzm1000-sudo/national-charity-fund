import { createHmac } from "node:crypto";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

/**
 * Privacy-first analytics.
 *
 * We record *what happened*, never *who* did it. A rotating, salted session
 * hash lets us count unique sessions without storing an IP or identity. In
 * discreet mode events are dropped entirely by the caller.
 */

const ANALYTICS_SALT = env.SESSION_SECRET;

/** Rotates daily so the hash is not a durable identifier. */
export function sessionHash(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
  const ua = headers.get("user-agent") ?? "unknown";
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", ANALYTICS_SALT)
    .update(`${ip}|${ua}|${day}`)
    .digest("hex")
    .slice(0, 24);
}

export interface TrackInput {
  type: string;
  path?: string;
  fundTypeCode?: string;
  causeId?: string;
  campaignId?: string;
  qrId?: string;
  discreet?: boolean;
  headers: Headers;
  meta?: Record<string, unknown>;
}

export async function track(input: TrackInput): Promise<void> {
  if (!env.ANALYTICS_ENABLED) return;
  if (input.discreet) return; // discreet mode: no analytics at all
  // Discreet mode can also be set globally via a first-party cookie.
  if (/kn_discreet=1/.test(input.headers.get("cookie") ?? "")) return;

  try {
    await prisma.analyticsEvent.create({
      data: {
        type: input.type,
        path: input.path ?? null,
        fundTypeCode: input.fundTypeCode ?? null,
        causeId: input.causeId ?? null,
        campaignId: input.campaignId ?? null,
        qrId: input.qrId ?? null,
        sessionHash: sessionHash(input.headers),
        discreet: false,
        meta: JSON.stringify(input.meta ?? {}),
      },
    });
  } catch (err) {
    console.error("[analytics] failed", input.type, err);
  }
}
