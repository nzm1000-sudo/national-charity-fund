/**
 * Fire-and-forget client analytics. Never blocks the UX; silently ignores
 * failures. Respects discreet mode by not sending anything.
 */
import { isDiscreetEnabled } from "@/lib/discreet";

export async function trackClient(
  type: string,
  payload: Record<string, unknown> = {},
  discreet = false,
): Promise<void> {
  if (discreet || isDiscreetEnabled()) return;
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
