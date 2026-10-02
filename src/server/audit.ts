import { prisma } from "@/lib/prisma";

export interface AuditInput {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Append-only audit trail. Never throws into the caller's path — an audit
 * failure must not break a business operation, but it is recorded to the log.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        before: input.before !== undefined ? JSON.stringify(input.before) : null,
        after: input.after !== undefined ? JSON.stringify(input.after) : null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to record", input.action, err);
  }
}
