import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatILS } from "@/lib/money";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/rbac";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { refundDonation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDonationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requirePermission("finance.read");
  const { id } = await params;

  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      fundType: true,
      cause: true,
      campaign: true,
      receipt: true,
      transactions: { orderBy: { createdAt: "desc" } },
      allocations: { include: { cause: true, fundRule: true } },
    },
  });
  if (!donation) notFound();

  const metadata = JSON.parse(donation.metadata || "{}") as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href="/admin/finance" className="hover:text-primary">
          כספים
        </Link>
        <span aria-hidden className="px-2">/</span>
        <span className="num text-ink-soft">{donation.publicId}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl num">{donation.publicId}</h1>
        <Badge tone={donation.status === "paid" ? "success" : "gold"}>
          {donation.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-display text-lg">פרטי התרומה</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="קופה" value={donation.fundType.nameHe} />
              <Row label="מטרה" value={donation.cause?.nameHe ?? "—"} />
              <Row label="סכום" value={formatILS(donation.amount)} />
              <Row label="אנונימי" value={donation.anonymous ? "כן" : "לא"} />
              <Row label="מצב דיסקרטי" value={donation.discreetMode ? "כן" : "לא"} />
              <Row label="שם" value={donation.anonymous ? "—" : donation.donorName ?? "—"} />
              <Row label="אימייל" value={donation.donorEmail ?? "—"} />
              <Row label="טלפון" value={donation.donorPhone ?? "—"} />
              <Row label="מקור" value={donation.source ?? "—"} />
              <Row label="ספק" value={donation.provider ?? "—"} />
              <Row label="אסמכתא ספק" value={donation.providerRef ?? "—"} />
            </dl>
            {typeof metadata.pidyon === "object" && metadata.pidyon && (
              <div className="mt-4 rounded-md bg-surface-2 p-3 text-sm">
                <p className="font-medium">פרטי פדיון</p>
                <pre className="mt-1 whitespace-pre-wrap text-xs text-muted">
                  {JSON.stringify(metadata.pidyon, null, 2)}
                </pre>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-display text-lg">קבלה</h2>
            {donation.receipt ? (
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="מספר" value={donation.receipt.number} />
                <Row label="סכום" value={formatILS(donation.receipt.amount)} />
                <Row label="סטטוס" value={donation.receipt.status} />
                <Row
                  label="הופקה"
                  value={new Intl.DateTimeFormat("he-IL", { dateStyle: "short" }).format(
                    donation.receipt.issuedAt,
                  )}
                />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted">לא הופקה קבלה.</p>
            )}

            {donation.status === "paid" && can(session.permissions, "finance.write") && (
              <form action={refundDonation} className="mt-5 border-t border-border pt-4">
                <input type="hidden" name="donationId" value={donation.id} />
                <p className="text-sm text-ink-soft">
                  ביטול מלא של {formatILS(donation.amount)}. הפעולה תיצור תנועת זיכוי ותתועד.
                </p>
                <Button variant="danger" size="sm" className="mt-3" type="submit">
                  ביצוע זיכוי
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">הקצאה</h2>
          <p className="mt-1 text-sm text-muted">
            כל שקל משויך לסוג קופה ולכלל הקצאה. הרשומה נשמרת עם גרסת הכלל.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pe-3 text-start font-medium">קופה</th>
                  <th className="py-2 pe-3 text-start font-medium">יעד</th>
                  <th className="py-2 pe-3 text-start font-medium">סכום</th>
                  <th className="py-2 pe-3 text-start font-medium">כלל</th>
                </tr>
              </thead>
              <tbody>
                {donation.allocations.map((a) => (
                  <tr key={a.id} className="border-b border-border/60">
                    <td className="py-2 pe-3">{a.fundTypeCode}</td>
                    <td className="py-2 pe-3">{a.cause?.nameHe ?? "ממתין להקצאה"}</td>
                    <td className="py-2 pe-3 num">{formatILS(a.amount)}</td>
                    <td className="py-2 pe-3 text-muted">{a.ruleCode ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">תנועות</h2>
          {donation.transactions.length === 0 ? (
            <p className="mt-3 text-sm text-muted">אין תנועות.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {donation.transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between border-b border-border/60 py-2">
                  <span>
                    {t.type} · {t.status}
                  </span>
                  <span className="num">{formatILS(t.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="num max-w-[60%] truncate text-end">{value}</dd>
    </div>
  );
}
