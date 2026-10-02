import { z } from "zod";

/**
 * Typed environment access. Fails fast on missing critical vars in production,
 * falls back to safe development defaults locally.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  APP_NAME: z.string().default("הקופה הלאומית"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  SESSION_SECRET: z.string().min(16).default("dev-only-change-me-0000000000"),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().default("admin@example.org"),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).default("ChangeMe123!"),
  PAYMENTS_PROVIDER: z.string().default("mock"),
  PAYMENTS_API_KEY: z.string().optional().default(""),
  PAYMENTS_WEBHOOK_SECRET: z.string().optional().default(""),
  EMAIL_PROVIDER: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default("no-reply@example.org"),
  EMAIL_API_KEY: z.string().optional().default(""),
  ANALYTICS_ENABLED: z
    .string()
    .default("true")
    .transform((v) => v !== "false"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
