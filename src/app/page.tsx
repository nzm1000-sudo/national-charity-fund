import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatILS } from "@/lib/money";
import { Emblem } from "@/components/layout/Emblem";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Disclosure } from "@/components/ui/disclosure";
import { publicCopy } from "@/components/ui/public-copy";

export const revalidate = 300;
const TRACKS = [
  { title: "השבת ממון", body: "ממון שאינו שלך, ואין דרך להשיבו לבעליו. נסייע לקבוע את הדרך הנכונה להשבה.", href: "/hashavat-mamon" },
  { title: "מעשר כספים", body: "חישוב המעשר מן ההכנסה, קביעת יעד ומעקב רציף לאורך השנה.", href: "/maaser" },
  { title: "צדקה", body: "בחירת יעד, סכום ותדירות. בשמך או בעילום שם.", href: "/tzedakah" },
  { title: "פדיון נפש", body: "על פי מנהג ישראל: שם האדם ושם אמו, נוסח הבקשה ותרומה כפי יכולתך.", href: "/pidyon" },
];
const DESTINATIONS = ["תרופות לחולים", "מזון למשפחות", "תמיכה באלמנות ויתומים", "בית הכנסת והמרכז הקהילתי בנתיבות", "החזקת אברכים ולומדי תורה", "סיוע לנזקקים"];
const QUESTIONS = ["ידוע לי ממי נלקח הממון. מה עליי לעשות?", "אינני יודע ממי נלקח הממון. מה עליי לעשות?", "אינני זוכר את הסכום המדויק.", "הממון נלקח מאנשים רבים."];

export default async function HomePage() {
  const [faqs, allocation, paid] = await Promise.all([
    prisma.faq.findMany({ where: { published: true, category: "restitution" }, orderBy: { sortOrder: "asc" }, take: 4 }),
    prisma.allocation.aggregate({ where: { donation: { status: "paid", provider: { not: "mock" } } }, _sum: { amount: true }, _count: true }),
    prisma.donation.aggregate({ where: { status: "paid", provider: { not: "mock" } }, _sum: { amount: true }, _count: true }),
  ]);
  const hasData = allocation._count > 0;
  return <>
    <Section>
      <div className="container-page text-center">
        <p className="eyebrow mx-auto">עמותת חסד יסובבנו · נתיבות</p>
        <div className="my-8 flex justify-center"><Emblem size={200} className="hero-emblem" /></div>
        <h1 className="text-4xl md:text-6xl">להשיב, לתקן ולתת</h1>
        <p className="section-lead mt-8">כתובת אחת להשבת ממון, למעשר, לצדקה ולפדיון נפש. כל מסלול מבואר על פי ההלכה, וכל תרומה מתועדת עד הגיעה ליעדה.</p>
        <div className="mx-auto mt-8 grid w-full max-w-[480px] grid-cols-2 gap-4">
          <ButtonLink href="/hashavat-mamon" fullWidth>להשבת ממון</ButtonLink><ButtonLink href="/tzedakah" variant="secondary" fullWidth>לתרומה</ButtonLink>
        </div>
        <p className="mx-auto mt-8 text-meta text-muted">אין צורך לפרט מה אירע. אפשר להשלים את התהליך בעילום שם.</p>
      </div>
    </Section>
    <Section className="border-y border-border bg-surface-2">
      <div className="container-page">
        <SectionHeading eyebrow="ארבעה מסלולים" title="בחירת המסלול" lead="לכל מסלול דין משלו ודרך משלו. תרומה אינה עוברת ממסלול למסלול אלא בהחלטה מפורשת." />
        <div className="equal-cards mt-12">{TRACKS.map(t => <article key={t.href} className="public-card"><h3>{t.title}</h3><p>{t.body}</p><Link href={t.href} aria-label={`לפרטי המסלול, ${t.title}`}>לפרטי המסלול</Link></article>)}</div>
      </div>
    </Section>
    <Section>
      <div className="container-page">
        <SectionHeading eyebrow="קופה נפרדת" title="צרכי רבים" lead="צרכי רבים אינם צדקה במובנה הרגיל. אלה מפעלים שהציבור כולו נהנה מהם לאורך זמן, ולכן הם היעד שקבעו חכמים לממון שבעליו אינם ידועים." />
        <p className="mx-auto mt-6 text-center text-caption text-muted">בבא קמא צד, ב. שולחן ערוך, חושן משפט שסו, ב.</p>
        <ul className="cause-grid mt-12">{DESTINATIONS.map(label => <li className="flex items-center gap-4 border border-border p-8 text-meta" key={label}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0"><path d="M4 21V9l8-5 8 5v12M2 21h20M9 21v-6h6v6" /></svg><span>{label}</span>
        </li>)}</ul>
        <div className="mt-8 text-center"><ButtonLink href="/tzrachei-rabim" variant="secondary">לפרטי הקופה</ButtonLink></div>
      </div>
    </Section>
    <Section className="border-y border-border bg-surface-2"><div className="container-page text-center"><SectionHeading title="לתרומה ישירה" lead="בחירת סכום ויעד בשלושה צעדים, בשמך או בעילום שם." /><div className="mt-8"><ButtonLink href="/tzedakah">לתרומה</ButtonLink></div></div></Section>
    <Section><div className="container-page"><SectionHeading eyebrow="אמון ושקיפות" title="לאן מגיעה התרומה" lead="כל תרומה משויכת לקופה מוגדרת ולכלל הקצאה מתועד. כאן אפשר לראות את היעדים, את המיזמים ואת התקדמותם." />
      {hasData && <div className="metrics"><div className="metric"><strong>{formatILS(paid._sum.amount ?? 0)}</strong><span>תרומות שהושלמו</span></div><div className="metric"><strong>{paid._count}</strong><span>מספר תרומות</span></div><div className="metric"><strong>{formatILS(allocation._sum.amount ?? 0)}</strong><span>תרומות שהוקצו</span></div></div>}
      <div className="mt-8 flex flex-wrap justify-center gap-4"><ButtonLink href="/where-the-money-goes">למרכז השקיפות</ButtonLink><ButtonLink href="/about" variant="secondary">אודות העמותה</ButtonLink></div>
    </div></Section>
    <Section className="border-t border-border"><div className="container-page"><SectionHeading eyebrow="שאלות ותשובות" title="לפני שמתחילים" lead="ריכזנו את השאלות שאנשים מהססים לשאול, ואת התשובות עליהן." /><div className="text-column mt-12 border-t border-border">{faqs.map((f,i) => <Disclosure key={f.id} summary={QUESTIONS[i] ?? f.question}>{publicCopy(f.answer)}</Disclosure>)}</div><div className="mt-8 text-center"><ButtonLink href="/faq" variant="ghost">לכל השאלות והתשובות</ButtonLink></div></div></Section>
  </>;
}
