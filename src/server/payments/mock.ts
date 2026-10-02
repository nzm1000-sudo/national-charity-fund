import { createHmac, timingSafeEqual } from "node:crypto";
import type {
  CreateIntentInput,
  CreateIntentResult,
  PaymentsProvider,
  RefundInput,
  RefundResult,
  WebhookEvent,
} from "./types";

/**
 * Mock payments provider for development and tests.
 *
 * It behaves like a hosted-page PSP: createIntent returns a URL to our own
 * mock checkout screen, and webhooks are HMAC-signed so the verification path
 * is exercised for real.
 */
export function createMockProvider(webhookSecret: string): PaymentsProvider {
  function sign(body: string): string {
    return createHmac("sha256", webhookSecret || "dev-secret")
      .update(body)
      .digest("hex");
  }

  return {
    id: "mock",

    async createIntent(input: CreateIntentInput): Promise<CreateIntentResult> {
      const providerRef = `mock_${input.donationPublicId}_${Date.now()}`;
      const url = new URL("/mock/pay", input.returnUrl);
      url.searchParams.set("ref", providerRef);
      url.searchParams.set("amount", String(input.amountAgorot));
      url.searchParams.set("return", input.returnUrl);
      return {
        provider: "mock",
        providerRef,
        status: "requires_action",
        redirectUrl: url.toString(),
      };
    },

    verifyWebhook(rawBody, signature): WebhookEvent | null {
      if (!signature) return null;
      const expected = sign(rawBody);
      const a = Buffer.from(signature);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

      try {
        const parsed = JSON.parse(rawBody) as {
          providerRef: string;
          status: WebhookEvent["status"];
          amountAgorot?: number;
          type?: WebhookEvent["type"];
          rawStatus?: string;
        };
        if (!parsed.providerRef || !parsed.status) return null;
        return {
          providerRef: parsed.providerRef,
          status: parsed.status,
          amountAgorot: parsed.amountAgorot,
          type: parsed.type ?? "charge",
          rawStatus: parsed.rawStatus,
        };
      } catch {
        return null;
      }
    },

    async refund(input: RefundInput): Promise<RefundResult> {
      return {
        ok: true,
        providerRef: input.providerRef,
        refundRef: `refund_${input.providerRef}_${Date.now()}`,
      };
    },
  };

  // exposed for the mock checkout screen / tests
}

/** Helper used by the mock checkout screen to produce a valid signature. */
export function signMockWebhook(body: string, secret: string): string {
  return createHmac("sha256", secret || "dev-secret").update(body).digest("hex");
}
