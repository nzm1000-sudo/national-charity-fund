import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  PRIMARY_TRACKS,
  getFundType,
} from "@/lib/domain/fund-types";
import { TRACK_ICONS, IconShield, IconArrowLeft } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { Disclosure } from "@/components/ui/disclosure";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [faqs, causes] = await Promise.all([
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
  ]);

  const tracks = PRIMARY_TRACKS.map((code) => getFundType(code)!).filter(Boolean);

  return (
    <>
      {/* Hero — calm and clear, not a wall of empty words */}
      <section className="border-b border-border bg-surface-2">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="rule-gold">
            <p className="text-sm font-medium text-gold">
              עמותת חסד יסובבנו · נתיבות
            </p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
              להשיב, לתקן ולתת
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              יש כסף שאינך יודע למי להשיב? רוצה להפריש מעשר, לתת צדקה, או
              לקיים פדיון נפש? כאן תמצא מסלול ברור, מכובד ודיסקרטי — בלי
              שאלות מיותרות.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/hashavat-mamon" size="lg">
                יש ממון להשיב
              </ButtonLink>
              <ButtonLink href="/tzedakah" size="lg" variant="secondary">
                רוצה לתרום
              </ButtonLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <IconShield className="text-primary" />
              לא נשאל על מה שקרה. אפשר להשלים תהליך בלי שם.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {tracks.map((t) => {
              const Icon = TRACK_ICONS[t.code];
              return (
                <Link
                  key={t.code}
                  href={t.route}
                  className="group rounded-card border border-border bg-surface p-5 shadow-hair transition-colors hover:border-primary"
                >
                  <Icon className="text-primary" />
                  <p className="mt-3 font-display text-lg font-medium">{t.nameHe}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {t.taglineHe}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Four tracks explained */}
      <Section>
        <div className="container-page">
          <SectionHeading
            rule
            eyebrow="ארבעה מסלולים"
            title="בחר/י את הדרך שמתאימה למצב"
            lead="כל מסלול עובד אחרת, כי כל צורך הוא אחר. אין ערבוב בין המסלולים ללא החלטה מודעת."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {tracks.map((t) => {
              const Icon = TRACK_ICONS[t.code];
              return (
                <Card key={t.code} className="h-full">
                  <CardBody className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-tint text-primary">
                        <Icon />
                      </span>
                      <h3 className="font-display text-xl font-medium">{t.nameHe}</h3>
                    </div>
                    <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                      {t.descriptionHe}
                    </p>
                    <div className="mt-5">
                      <Link
                        href={t.route}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
                      >
                        למסלול {t.nameHe}
                        <IconArrowLeft width={17} height={17} />
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Public needs — kept distinct from tzedakah */}
      <section className="border-y border-border bg-surface-2">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <SectionHeading
            rule
            eyebrow="קטגוריה נפרדת"
            title="צרכי רבים"
            lead="לא אותה קטגוריה כמו צדקה. מדובר בדברים שהציבור נהנה מהם באופן מתמשך — ולכן מתאימים במיוחד להשבת ממון שאין לו בעלים ידועים."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {causes.slice(0, 6).map((c) => (
              <li
                key={c.id}
                className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-ink-soft"
              >
                {c.nameHe}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Simple donate band */}
      <Section>
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-card border border-primary/20 bg-primary-tint p-8 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl">רוצה פשוט לתרום?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                בחר/י סכום ומטרה — הכול מסודר, ואת/ה יכול/ה להישאר אנונימי/ת.
              </p>
            </div>
            <ButtonLink href="/tzedakah" size="lg" className="shrink-0">
              לתרום עכשיו
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Trust */}
      <Section className="border-t border-border bg-surface">
        <div className="container-page">
          <SectionHeading
            rule
            eyebrow="אמון ושקיפות"
            title="לאן הכסף מגיע?"
            lead="כל שקל משויך לסוג קופה מוגדר, עם כלל הקצאה מתועד. אפשר לראות את המטרות, הפרויקטים וההתקדמות."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/where-the-money-goes" variant="secondary">
              למרכז השקיפות
            </ButtonLink>
            <ButtonLink href="/about" variant="ghost">
              על העמותה
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* FAQ preview */}
      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <SectionHeading
            rule
            eyebrow="שאלות שכולם שואלים"
            title="רוצה להבין לפני?"
            lead="ריכזנו את השאלות שאנשים חוששים לשאול — בפתיחות ובפשטות."
          />
          <div className="border-t border-border">
            {faqs.map((f) => (
              <Disclosure key={f.id} summary={f.question}>
                {f.answer}
              </Disclosure>
            ))}
            <div className="pt-5">
              <Link href="/faq" className="text-sm font-medium text-primary">
                כל השאלות
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
