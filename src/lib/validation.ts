import { z } from "zod";
import { FUND_TYPES } from "@/lib/domain/fund-types";

const fundTypeCodes = FUND_TYPES.map((f) => f.code) as [string, ...string[]];

export const MAX_DONATION_AGOROT = 100_000_000; // ₪1,000,000

export const createDonationSchema = z.object({
  fundType: z.enum(fundTypeCodes),
  amountAgorot: z
    .number()
    .int("סכום חייב להיות במספרים שלמים (אגורות)")
    .positive("סכום חייב להיות גדול מאפס")
    .max(MAX_DONATION_AGOROT, "הסכום גדול מהמותר"),
  causeId: z.string().cuid().nullish(),
  campaignId: z.string().cuid().nullish(),
  qrId: z.string().cuid().nullish(),
  donorName: z.string().trim().max(120).optional(),
  donorEmail: z.string().trim().email("כתובת אימייל אינה תקינה").max(160).optional().or(z.literal("")),
  donorPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "מספר טלפון אינו תקין")
    .optional()
    .or(z.literal("")),
  anonymous: z.boolean().default(false),
  diligentDiscretion: z.boolean().default(false), // discrete mode
  designation: z.string().trim().max(200).optional(),
  dedication: z.string().trim().max(300).optional(),
  source: z.string().trim().max(80).optional(),
  /** Restitution flow answers, kept minimal and optional. */
  restitution: z
    .object({
      ownerKnown: z.enum(["yes", "no", "unsure"]),
      reachable: z.enum(["yes", "no", "unknown"]).optional(),
      manyPeople: z.boolean().optional(),
      amountKnowledge: z.enum(["exact", "range", "unknown"]).optional(),
      causeType: z.enum(["theft", "damage", "debt", "error", "doubt"]).optional(),
    })
    .optional(),
  /** pidyon nefesh details (name + mother's name + request). */
  pidyon: z
    .object({
      name: z.string().trim().max(120).optional(),
      motherName: z.string().trim().max(120).optional(),
      request: z.string().trim().max(300).optional(),
    })
    .optional(),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;

export const analyticsEventSchema = z.object({
  type: z.string().min(1).max(60),
  path: z.string().max(200).optional(),
  fundTypeCode: z.string().max(40).optional(),
  causeId: z.string().max(40).optional(),
  campaignId: z.string().max(40).optional(),
  qrId: z.string().max(40).optional(),
  discreet: z.boolean().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("כתובת אימייל אינה תקינה"),
  password: z.string().min(1, "יש להזין סיסמה").max(200),
});

/** Turns a ZodError into a flat Hebrew-friendly field map. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
