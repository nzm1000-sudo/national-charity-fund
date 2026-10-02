import { prisma } from "@/lib/prisma";
import type { HalachicRule, HalachicSourceRef } from "@/lib/domain/halacha";

interface RuleWithSources {
  code: string;
  topic: string;
  subtopic: string | null;
  condition: string;
  decision: string;
  publicExplanation: string;
  internalReasoning: string | null;
  confidence: string;
  status: string;
  sources: Array<{ role: string; source: { code: string; citation: string | null; quote: string | null } }>;
}

/**
 * Loads all rules from the DB and decodes them into domain objects.
 * Content lives in the DB so halacha staff can edit it without a deploy.
 */
export async function loadHalachicRules(): Promise<HalachicRule[]> {
  const rows = (await prisma.halachicRule.findMany({
    include: {
      sources: { include: { source: true } },
    },
  })) as unknown as RuleWithSources[];

  return rows.map((r) => {
    const sources: HalachicSourceRef[] = r.sources.map((s) => ({
      code: s.source.code,
      role: (s.role as HalachicSourceRef["role"]) ?? "supporting",
      citation: s.source.citation ?? undefined,
    }));
    return {
      code: r.code,
      topic: r.topic,
      subtopic: r.subtopic ?? undefined,
      condition: JSON.parse(r.condition || "{}"),
      decision: JSON.parse(r.decision || "{}"),
      publicExplanation: r.publicExplanation,
      internalReasoning: r.internalReasoning ?? undefined,
      confidence: r.confidence as HalachicRule["confidence"],
      status: r.status as HalachicRule["status"],
      priority: 100,
      sources,
    };
  });
}

/** Full source records for one rule — used by the admin halacha module. */
export async function getRuleWithSources(code: string) {
  return prisma.halachicRule.findUnique({
    where: { code },
    include: {
      sources: { include: { source: true } },
      versions: { orderBy: { version: "desc" } },
      fundRules: true,
    },
  });
}
