import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/section";
import { Disclosure } from "@/components/ui/disclosure";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description:
    "שאלות שאנשים באמת שואלים על השבת ממון, צדקה, מעשר ופדיון נפש — בפתיחות ובפשטות.",
};

const CATEGORY_LABELS: Record<string, string> = {
  restitution: "השבת ממון",
  privacy: "פרטיות ודיסקרטיות",
  maaser: "מעשר כספים",
  public_needs: "צרכי רבים",
  pidyon: "פדיון נפש",
  trust: "שקיפות",
  general: "כללי",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Section className="pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-page max-w-3xl">
        <SectionHeading
          rule
          eyebrow="רוצה להבין לפני?"
          title="שאלות נפוצות"
          lead="ריכזנו את השאלות שאנשים חוששים לשאול — בלי שיפוטיות."
        />

        <div className="mt-10 space-y-10">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-2 font-display text-xl">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="border-t border-border">
                {items.map((f) => (
                  <Disclosure key={f.id} summary={f.question}>
                    {f.answer}
                  </Disclosure>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-card border border-primary/20 bg-primary-tint p-6">
          <h2 className="font-display text-xl">לא מצאת תשובה?</h2>
          <p className="mt-2 text-sm text-ink-soft">
            אפשר לפנות אלינו, ואפשר גם להתייעץ עם רב במקרה אישי מורכב.
          </p>
          <div className="mt-4">
            <ButtonLink href="/hashavat-mamon" variant="secondary">
              למסלול השבת ממון
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
