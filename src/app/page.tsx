import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PRIMARY_TRACKS, getFundType } from "@/lib/domain/fund-types";
import { CircleSeal } from "@/components/brand/circle-seal";
import { TrackRing, type TrackItem } from "@/components/home/track-ring";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { Disclosure } from "@/components/ui/disclosure";
import { IconShield, IconCommunity, IconArrowLeft, IconLock, IconScale } from "@/components/icons";
import { trackColor } from "@/lib/tracks";

export const revalidate = 300;

const WINGS = [
  "כיתות סיוע לילדים בעלי צרכים מיוחדים",
  "חדרי אירוח לחיילים בודדים",
  "בית כנסת ומניינים יומיים",
  "מקוואות לנשים ולגברים",
  "מרכז ייעוץ אישי, זוגי ומשפחתי",
  "חלוקת מזון וארוחות חמות לנזקקים",
  "ייעוץ רפואי ללא עלות",
  "כוללים ושיעורי תורה בכל הרמות",
];

const TRUST = [
  {
    icon: IconLock,
    title: "דיסקרטיות מלאה",
    body: "אין צורך לתאר מה קרה ואין צורך בשם. אפשר להשלים תהליך שלם באנונימיות.",
  },
  {
    icon: IconShield,
    title: "שקיפות בכל שקל",
    body: "כל תרומה משויכת לסוג קופה וליעד, עם כלל ההקצאה שנרשם לצידה.",
  },
  {
    icon: IconScale,
    title: "מקורות הלכתיים מתועדים",
    body: "כל כלל מבוסס מקורות ומסומן בסטטוס; אין המצאה של מקורות.",
  },
];

export default async function HomePage() {
  const [faqs, causes, paidAgg] = await Promise.all([
    prisma.faq.findMany({
      where: { published: true, category: { in: ["restitution", "privacy", "trust"] } },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    prisma.cause.findMany({
      where: { publicVisible: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.donation.aggregate({ where: { status: "paid" }, _sum: { amount: true }, _count: true }),
  ]);

  const tracks: TrackItem[] = [
    ...PRIMARY_TRACKS,
    "public_needs" as (typeof PRIMARY_TRACKS)[number],
  ].map((code) => {
    const f = getFundType(code)!;
    return { code: f.code, name: f.nameHe, tagline: f.taglineHe, route: f.route };
  });

  const hasData = (paidAgg._sum.amount ?? 0) > 0;

  return (
    <>
      {/* Opening — the seal at the centre, the five tracks around it */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="container-page py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">עמותת חסד יסובבנו · נתיבות</p>
            <h1 className="mt-4 text-[var(--text-3xl)] sm:text-[var(--text-4xl)]">
              להשיב, לתקן ולתת
            </h1>
            <p className="serif mx-auto mt-5 text-[var(--text-lg)] leading-relaxed text-[var(--color-text-muted)]">
              הקופה הלאומית היא הכתובת להשבת ממון, לצרכי רבים, למעשר, לצדקה ולפדיון נפש —
              מסלול ברור, מכובד ודיסקרטי.
            </p>
          </div>

          <div className="mt-14">
            <TrackRing tracks={tracks}>
              <CircleSeal
                count={1000}
                size={320}
                alive
                className="h-auto max-w-full text-[var(--color-text)]"
              />
            </TrackRing>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <Section>
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-3">
            {TRUST.map((t) => (
              <Card key={t.title}>
                <CardBody className="text-center">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[var(--color-primary-tint)] text-[var(--color-accent)]">
                    <t.icon width={24} height={24} />
                  </span>
                  <h2 className="mt-4 font-display text-lg font-black">{t.title}</h2>
                  <p className="mt-2 text-[var(--text-meta)] leading-relaxed text-[var(--color-text-muted)]">
                    {t.body}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Public needs — a distinct category */}
      <Section className="border-y border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="container-page">
          <SectionHeading
            rule
            eyebrow="קטגוריה נפרדת"
            title="צרכי רבים"
            lead="לא אותה קטגוריה כמו צדקה: דברים שהציבור נהנה מהם באופן מתמשך — ולכן מתאימים גם להשבת ממון שאין לו בעלים ידועים."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/cause/${c.slug}`}
                  className="flex h-full items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-surface)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                    style={{ color: trackColor("public_needs") }}
                  >
                    <IconCommunity width={24} height={24} />
                  </span>
                  <span className="text-[var(--text-base)] text-[var(--color-text)]">{c.nameHe}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Kezohar HaRakiah */}
      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionHeading
            rule
            eyebrow="מערכת אחת"
            title="כזוהר הרקיע"
            lead="הקופה הלאומית היא חלק ממערכת אחת עם מתחם קהילתי בבנייה בנתיבות ועם אפליקציית כזוהר הרקיע — זמנים, לימוד ומקורות."
          />
          <div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {WINGS.map((wing, i) => (
                <li
                  key={wing}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <span className="num font-display text-lg font-black text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--text-meta)] leading-relaxed text-[var(--color-text)]">
                    {wing}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <a
                href="https://nzm1000-sudo.github.io/kezohar369/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--text-meta)] font-medium text-[var(--color-link)] hover:underline"
              >
                למתחם כזוהר הרקיע
                <IconArrowLeft width={17} height={17} />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Transparency */}
      <Section className="border-y border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="container-page">
          <SectionHeading
            rule
            eyebrow="אמון ושקיפות"
            title="לאן הכסף מגיע?"
            lead="כל שקל משויך לסוג קופה ולמטרה, עם כלל הקצאה מתועד. אנחנו מציגים רק נתונים אמיתיים."
          />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/where-the-money-goes">למרכז השקיפות</ButtonLink>
            {!hasData && (
              <p className="text-[var(--text-meta)] text-[var(--color-text-muted)]">
                הנתונים יפורסמו בקרוב.
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* FAQ preview */}
      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <SectionHeading
            rule
            eyebrow="רוצה להבין לפני?"
            title="שאלות שכולם שואלים"
            lead="ריכזנו את השאלות שאנשים חוששים לשאול — בפתיחות ובפשטות."
          />
          <div className="border-t border-[var(--color-border)]">
            {faqs.map((f) => (
              <Disclosure key={f.id} summary={f.question}>
                {f.answer}
              </Disclosure>
            ))}
            <div className="pt-6">
              <Link href="/faq" className="text-[var(--text-meta)] font-medium text-[var(--color-link)]">
                כל השאלות
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
