/**
 * Payments provider abstraction.
 *
 * The platform never stores a full card number or CVV — only provider tokens.
 * Concrete providers (Israeli PSP, Apple/Google Pay, Bit, standing orders)
 * implement this interface; the app depends only on the interface.
 */

export type PaymentStatus =
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed";

export interface CreateIntentInput {
  donationPublicId: string;
  amountAgorot: number;
  currency: string;
  description: string;
  returnUrl: string;
  /** Optional saved provider token for recurring / one-click. */
  tokenRef?: string;
  recurring?: { interval: "monthly" | "yearly" };
}

export interface CreateIntentResult {
  provider: string;
  providerRef: string;
  status: PaymentStatus;
  /** Hosted page URL (never hosted fields with our origin). */
  redirectUrl?: string;
}

export interface WebhookEvent {
  providerRef: string;
  status: PaymentStatus;
  amountAgorot?: number;
  type: "charge" | "refund" | "recurring";
  rawStatus?: string;
}

export interface RefundInput {
  providerRef: string;
  amountAgorot: number;
  reason?: string;
}

export interface RefundResult {
  ok: boolean;
  providerRef: string;
  refundRef?: string;
}

export interface PaymentsProvider {
  id: string;
  createIntent(input: CreateIntentInput): Promise<CreateIntentResult>;
  /** Verifies signature and returns the event, or null if invalid. */
  verifyWebhook(rawBody: string, signature: string | null): WebhookEvent | null;
  refund(input: RefundInput): Promise<RefundResult>;
}
