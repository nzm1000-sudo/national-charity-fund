import { loadHalachicRules } from "@/server/halacha-repo";
import { evaluateRules } from "@/lib/domain/halacha";
import { HALACHIC_DISCLAIMER_HE } from "@/lib/domain/halachic-rules-data";
import { prisma } from "@/lib/prisma";
import { Disclosure } from "@/components/ui/disclosure";
import { Badge } from "@/components/ui/card";

/**
 * Public-facing halachic note for a fund type: one calm explanation, with the
 * sources tucked behind progressive disclosure. Internal reasoning is never
 * rendered here.
 */
export async function HalachaNote({
  fundType,
  answers,
}: {
  fundType: string;
  answers?: Record<string, string>;
}) {
  const rules = await loadHalachicRules();
  const matches = evaluateRules(rules, { fundType, answers });
  if (matches.length === 0) return null;

  const rule = matches[0].rule;
  const codes = rule.sources.map((s) => s.code);
  const sources = await prisma.halachicSource.findMany({
    where: { code: { in: codes } },
  });
  const sourceByCode = Object.fromEntries(sources.map((s) => [s.code, s]));

  const statusLabel: Record<string, string> = {
    verified: "מבוסס היטב",
    strong_basis: "מבוסס במקורות",
    disputed: "קיימת מחלוקת",
    provisional: "אפשרות סבירה",
    needs_review: "בעיון",
  };

  return (
    <div className="not-prose">
      <p className="text-[15px] leading-relaxed text-ink-soft">
        {rule.publicExplanation}
      </p>
      <Disclosure summary="להסבר נוסף ולמקורות" className="mt-3">
        <div className="space-y-3">
          <p className="text-sm">
            <Badge tone={rule.status === "disputed" ? "gold" : "primary"}>
              {statusLabel[rule.status] ?? rule.status}
            </Badge>
          </p>
          <ul className="space-y-3">
            {rule.sources.map((s) => {
              const src = sourceByCode[s.code];
              if (!src) return null;
              return (
                <li key={s.code} className="text-sm">
                  <p className="font-medium text-ink">
                    {src.title}
                    {src.work ? ` — ${src.work}` : ""}
                    {src.citation ? `, ${src.citation}` : ""}
                  </p>
                  {src.quote && (
                    <p className="mt-1 border-s-2 border-gold/60 ps-3 italic text-ink-soft">
                      „{src.quote}”
                    </p>
                  )}
                  {!src.quote && src.paraphrase && (
                    <p className="mt-1 text-muted">{src.paraphrase}</p>
                  )}
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-primary underline decoration-dotted"
                    >
                      למקור
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="border-t border-border pt-3 text-xs text-muted">
            {HALACHIC_DISCLAIMER_HE}
          </p>
        </div>
      </Disclosure>
    </div>
  );
}
