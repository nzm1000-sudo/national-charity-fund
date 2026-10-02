import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatILS } from "@/lib/money";
import { Section, SectionHeading } from "@/components/ui/section";
import { publicCopy } from "@/components/ui/public-copy";

export const revalidate = 60;
export const metadata: Metadata = { title:"לאן מגיעה התרומה",description:"כל שקל משויך לקופה ולכלל הקצאה מתועד. כאן מוצגים היעדים, המיזמים והתקדמותם." };

export default async function TransparencyPage() {
  const [causes,allocations,campaigns,paid] = await Promise.all([
    prisma.cause.findMany({where:{publicVisible:true},orderBy:{sortOrder:"asc"}}),
    prisma.allocation.groupBy({by:["causeId"],where:{donation:{status:"paid",provider:{not:"mock"}}},_sum:{amount:true}}),
    prisma.campaign.findMany({where:{publicVisible:true,active:true},include:{donations:{where:{status:"paid",provider:{not:"mock"}}}}}),
    prisma.donation.aggregate({where:{status:"paid",provider:{not:"mock"}},_sum:{amount:true},_count:true}),
  ]);
  const totals = new Map(allocations.map(a => [a.causeId,a._sum.amount ?? 0]));
  const hasData = allocations.length > 0;
  return <Section><div className="container-page"><SectionHeading eyebrow="אמון ושקיפות" title="לאן מגיעה התרומה" lead="כל שקל משויך לקופה ולכלל הקצאה מתועד. כאן מוצגים היעדים, המיזמים והתקדמותם." />
    {hasData ? <div className="metrics"><div className="metric"><strong>{formatILS(paid._sum.amount ?? 0)}</strong><span>תרומות שהושלמו</span></div><div className="metric"><strong>{paid._count}</strong><span>מספר תרומות</span></div><div className="metric"><strong>{formatILS(allocations.reduce((s,a) => s + (a._sum.amount ?? 0),0))}</strong><span>סכום שהוקצה</span></div></div> : <p className="mx-auto mt-12 text-center text-muted">הנתונים יפורסמו בקרוב.</p>}
    {campaigns.length > 0 && <div className="mt-16 grid gap-6 md:grid-cols-2">{campaigns.map(c => { const raised = c.donations.reduce((s,d) => s + d.amount,0); return <article key={c.id} className="public-card"><h3>{c.nameHe}</h3><p>יעד התרומה: {publicCopy(c.summary ?? "פרטי היעד יפורסמו בקרוב.")}</p><dl className="text-meta"><dt>סכום שגויס</dt><dd className="num">{formatILS(raised)}</dd><dt>סכום נדרש</dt><dd>{c.goalAmount ? formatILS(c.goalAmount) : "[לאישור]"}</dd></dl>{c.goalAmount && <progress value={raised} max={c.goalAmount} aria-label={`התקדמות ${c.nameHe}`} className="w-full" />}<p>עדכון אחרון: <bdi>{new Intl.DateTimeFormat("he-IL").format(c.updatedAt)}</bdi></p></article>; })}</div>}
    <h2 className="mt-16 text-center text-2xl">יעדי התרומה</h2>
    <ul className="text-column mt-8 divide-y divide-border border-y border-border">{causes.map(c => <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-6"><div><h3 className="text-xl">{publicCopy(c.nameHe)}</h3>{c.summary && <p className="mt-2 text-meta text-muted">{publicCopy(c.summary)}</p>}</div><div className="flex items-center gap-4">{hasData && totals.has(c.id) && <bdi>{formatILS(totals.get(c.id)!)}</bdi>}<Link href={`/cause/${c.slug}`} className="inline-flex min-h-11 items-center text-meta text-link">לפרטי היעד</Link></div></li>)}</ul>
  </div></Section>;
}
