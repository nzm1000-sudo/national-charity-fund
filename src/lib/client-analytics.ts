/**
 * Fire-and-forget client analytics. Never blocks the UX; silently ignores
 * failures. Respects discreet mode and the static (GitHub Pages) preview.
 */
import { isDiscreetEnabled } from "@/lib/discreet";

const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

export async function trackClient(
  type: string,
  payload: Record<string, unknown> = {},
  discreet = false,
): Promise<void> {
  if (discreet || STATIC_DEMO || isDiscreetEnabled()) return;
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
