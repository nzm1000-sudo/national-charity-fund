import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/section";
import { Disclosure } from "@/components/ui/disclosure";
import { ButtonLink } from "@/components/ui/button";
import { publicCopy } from "@/components/ui/public-copy";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "שאלות ותשובות",
  description:
    "שאלות שאנשים באמת שואלים על השבת ממון, צדקה, מעשר ופדיון נפש — בפתיחות ובפשטות.",
};

const CATEGORY_LABELS: Record<string, string> = {
  restitution: "השבת ממון",
  privacy: "פרטיות וצנעה",
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
      name: publicCopy(f.question),
      acceptedAnswer: { "@type": "Answer", text: publicCopy(f.answer) },
    })),
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-page max-w-3xl">
        <SectionHeading
          rule
            eyebrow="מקורות והכוונה"
            title="שאלות ותשובות"
            lead="התשובות מבוססות על מקורות הלכתיים מתועדים. במקרה אישי מורכב יש להתייעץ עם רב פוסק."
        />

        <div className="mt-10 space-y-10">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-6 text-center font-display text-xl">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="border-t border-border">
                {items.map((f) => (
                  <Disclosure key={f.id} summary={publicCopy(f.question)}>
                    {publicCopy(f.answer)}
                  </Disclosure>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-card border border-primary/20 bg-primary-tint p-6">
          <h2 className="font-display text-xl">להכוונה נוספת</h2>
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
