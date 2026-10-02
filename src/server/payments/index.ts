import { env } from "@/lib/env";
import { createMockProvider } from "./mock";
import type { PaymentsProvider } from "./types";

/**
 * Resolves the configured payments provider. Real providers are added here as
 * adapters without touching call sites.
 */
export function getPaymentsProvider(): PaymentsProvider {
  switch (env.PAYMENTS_PROVIDER) {
    case "mock":
    default:
      return createMockProvider(env.PAYMENTS_WEBHOOK_SECRET);
  }
}

export type { PaymentsProvider } from "./types";
