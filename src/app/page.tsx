import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowDown, HandHeart, RotateCcw, Calculator, Heart, Sparkles, ShieldCheck, BookOpen, Eye, Utensils, Pill, Users, Landmark, GraduationCap, FileCheck, School } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatILS } from "@/lib/money";
import { ButtonLink } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { publicCopy } from "@/components/ui/public-copy";
import { QuickDonation } from "@/components/quick-donation";
import { PaymentSection } from "@/components/payment-section";

export const revalidate = 300;
const TRACKS = [
  { title: "השבת ממון", kicker: "להשיב בלב שקט", icon: RotateCcw, body: "ממון שאינו שלך, ואין דרך להשיבו לבעליו. מסלול מסודר לבירור הדרך הנכונה, בלי לפרט מה אירע.", href: "/hashavat-mamon" },
  { title: "מעשר כספים", kicker: "לתת מתוך הברכה", icon: Calculator, body: "מחשבים את המעשר מן ההכנסה ובוחרים יעד מתאים. החלטה קטנה שהופכת לחלק מהחיים.", href: "/maaser" },
  { title: "צדקה", kicker: "להיות שם בשביל מישהו", icon: Heart, body: "בוחרים סכום ומטרה הקרובה ללב. למשפחות, לחולים ולמי שזקוק ליד מושטת, בשמך או בעילום שם.", href: "/tzedakah" },
  { title: "פדיון נפש", kicker: "לתת מקום לתפילה", icon: Sparkles, body: "שם האדם ושם אמו, בקשה אישית ותרומה לפי היכולת. על פי מנהג ישראל, בצנעה ובכבוד.", href: "/pidyon" },
];
const DESTINATIONS = [{ title: "מזון למשפחות", icon: Utensils }, { title: "תמיכה במימון תרופות שאינן בסל הבריאות", icon: Pill }, { title: "אלמנות ויתומים", icon: Users }, { title: "חינוך לנוער וילדים בעלי מורכבויות", icon: School }, { title: "לומדי תורה", icon: GraduationCap }, { title: "סיוע לנזקקים", icon: HandHeart }];
const QUESTIONS = ["ידוע לי ממי נלקח הממון. מה עליי לעשות?", "אינני יודע ממי נלקח הממון. מה עליי לעשות?", "אינני זוכר את הסכום המדויק.", "הממון נלקח מאנשים רבים."];

export default async function HomePage() {
  const [faqs, allocation, paid] = await Promise.all([
    prisma.faq.findMany({ where: { published: true, category: "restitution" }, orderBy: { sortOrder: "asc" }, take: 4 }),
    prisma.allocation.aggregate({ where: { donation: { status: "paid", provider: { not: "mock" } } }, _sum: { amount: true }, _count: true }),
    prisma.donation.aggregate({ where: { status: "paid", provider: { not: "mock" } }, _sum: { amount: true }, _count: true }),
  ]);
  const hasData = allocation._count > 0;
  const assetPath = process.env.STATIC_EXPORT === "1" ? process.env.PAGES_BASE_PATH || "" : "";
  return <>
    <section className="giving-hero" aria-labelledby="hero-title">
      <Image className="hero-photo" src={`${assetPath}/money-to-good.jpg`} alt="" fill priority sizes="100vw" unoptimized />
      <div className="hero-shade" />
      <div className="container-page hero-content"><Image className="hero-fund-mark" src={`${assetPath}/fund-icon-512.png`} alt="הלוגו של הקופה הלאומית" width={77} height={77} unoptimized /><p className="hero-eyebrow">ארגון חסד יסובבנו</p><span className="hero-brand-ornament" aria-hidden="true"><span /></span><h1 id="hero-title">הקופה הלאומית<span>להשיב, <em>לתת</em> ולתקן.</span></h1><p className="hero-lead">יש מעשים טובים שמשנים עולמות שלמים.<br />הכתובת שלך להשבת ממון, למעשר, לצדקה ולפדיון נפש. בצנעה, בשקיפות ועל פי ההלכה.</p><div className="hero-actions"><ButtonLink href="#give" className="button-lime">התיקון הוא הנתינה <ArrowLeft size={20} aria-hidden="true" /></ButtonLink><ButtonLink href="/hashavat-mamon" className="button-on-photo" variant="secondary">להשבת ממון</ButtonLink></div><p className="hero-privacy"><ShieldCheck size={17} aria-hidden="true" /><strong>דיסקרטיות מובטחת והגנת פרטיות גבוהה</strong></p><Link href="#tracks" className="hero-scroll">הדרכים לתת <ArrowDown size={16} aria-hidden="true" /></Link></div><span className="photo-caption">צילום להמחשה · Unsplash</span>
    </section>
    <div className="trust-ribbon"><div className="container-page"><span><BookOpen aria-hidden="true" /><span>מסלולים על פי ההלכה</span></span><span><Eye aria-hidden="true" /><span>שקיפות בהקצאת התרומה</span></span><span><ShieldCheck aria-hidden="true" /><span>פרטיות ובחירה בעילום שם</span></span></div></div>
    <section id="tracks" className="home-section"><div className="container-page"><div className="home-heading"><p className="eyebrow">כוונה אחת. ארבע דרכים.</p><h2>לכל שגיאה יש תיקון</h2><p>נתינה וחסד - שלמות ושלווה</p></div><div className="track-grid">{TRACKS.map((track, index) => <article key={track.href} className={`track-card track-${index}`}><div className="track-top"><track.icon size={28} strokeWidth={1.5} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></div><p className="track-kicker">{track.kicker}</p><h3>{track.title}</h3><p className="track-body">{track.body}</p><Link href={track.href} aria-label={`למסלול ${track.title}`}>למסלול <ArrowLeft size={18} aria-hidden="true" /></Link></article>)}</div><p className="track-footnote">תרומה אינה עוברת ממסלול למסלול אלא בהחלטה מפורשת.</p></div></section>
    <section id="give" className="giving-band"><div className="container-page giving-layout"><div className="giving-copy"><p className="eyebrow">פותחים את היד. פותחים את הלב.</p><h2>הפעולה פשוטה,<br /><span>המשמעות עצומה.</span></h2><p>פעמים שזו ארוחה משביעה לילדים קטנים, לפעמים זו תרופה לחולה במצוקה ולפעמים זה בשביל שהוא והיא לא ישארו לבד.</p><Link href="/tzedakah">לכל פרטי מסלול הצדקה <ArrowLeft size={18} aria-hidden="true" /></Link></div><QuickDonation /></div></section>
    <section className="home-section"><div className="container-page"><div className="home-heading"><p className="eyebrow">אנשים מאחורי כל נתינה</p><h2>הטוב מגיע רחוק.</h2><p>אלו תחומי הסיוע של הקופה. היעדים הזמינים לתרומה מוצגים בכל מסלול בנפרד.</p></div><div className="impact-layout"><figure className="impact-photo"><Image src={`${assetPath}/shared-table.jpg`} alt="קערת ירקות טריים, להמחשת תחום הסיוע במזון" fill sizes="(max-width: 767px) 100vw, 50vw" unoptimized /><figcaption>צילום להמחשה · Unsplash</figcaption></figure><div className="impact-destinations">{DESTINATIONS.map(destination => <div key={destination.title}><destination.icon size={26} strokeWidth={1.5} aria-hidden="true" /><h3>{destination.title}</h3></div>)}</div></div><div className="public-needs-note"><Landmark size={28} aria-hidden="true" /><div><h3>צרכי רבים: קופה נפרדת, אחריות משותפת.</h3><p>להשבת ממון שבעליו אינם ידועים יש כללים משלה. לא כל יעד צדקה מתאים לצרכי רבים; התאמת המקרה והיעד נעשית במסלול הייעודי.</p></div><ButtonLink href="/tzrachei-rabim" variant="secondary">לפרטי הקופה <ArrowLeft size={18} aria-hidden="true" /></ButtonLink></div></div></section>
    <section className="transparency-band home-section"><div className="container-page"><div className="home-heading"><p className="eyebrow">אמון לא דורשים - אמון בונים.</p><h2>לתת, לתמוך,<br />להגן ולסייע.</h2><p>כל תרומה משויכת לקופה מוגדרת ולכלל הקצאה מתועד. הכוונה שלכם נשמרת לאורך הדרך.</p></div><div className="transparency-grid"><div><BookOpen aria-hidden="true" /><h3>מקורות, לא הבטחות</h3><p>הסברים הלכתיים עם מקורות מתועדים. במקרה אישי מורכב מתייעצים עם רב פוסק.</p></div><div><FileCheck aria-hidden="true" /><h3>ייעוד ברור לכל תרומה</h3><p>הקופה, היעד וכלל ההקצאה מתועדים. נתוני פעילות מוצגים.</p></div><div><ShieldCheck aria-hidden="true" /><h3>כבוד לפרטיות שלכם</h3><p>עילום שם. ודיסקרטיות, צנעה וסתר.</p></div></div>
      {hasData && <div className="metrics"><div className="metric"><strong>{formatILS(paid._sum.amount ?? 0)}</strong><span>תרומות שהושלמו</span></div><div className="metric"><strong>{paid._count}</strong><span>מספר תרומות</span></div><div className="metric"><strong>{formatILS(allocation._sum.amount ?? 0)}</strong><span>תרומות שהוקצו</span></div></div>}
      <div className="transparency-actions"><ButtonLink href="/where-the-money-goes" className="button-lime">למרכז השקיפות <ArrowLeft size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/about" variant="secondary">להכיר את העמותה</ButtonLink></div></div></section>
    <section className="home-section"><div className="container-page faq-layout"><div><p className="eyebrow">מותר לשאול</p><h2>לפני שעושים<br />את הצעד הראשון.</h2><p>גם לשאלות שקשה לשאול יש מקום.<br />אפשר להתחיל כאן, בקצב שלכם.</p><ButtonLink href="/faq" variant="ghost">לכל השאלות והתשובות <ArrowLeft size={18} aria-hidden="true" /></ButtonLink></div><div className="faq-list">{faqs.map((faq, index) => <Disclosure key={faq.id} summary={QUESTIONS[index] ?? faq.question}>{publicCopy(faq.answer)}</Disclosure>)}</div></div></section>
    <PaymentSection />
    <section className="closing-band"><div className="container-page"><HandHeart size={40} strokeWidth={1.3} aria-hidden="true" /><h2>טוב מתחיל במעשה אחד.</h2><ButtonLink href="#give">המעשה הבא שלי <ArrowLeft size={18} aria-hidden="true" /></ButtonLink></div></section>
  </>;
}
