import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatILS } from "@/lib/money";
import { Card, CardBody, Badge } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    paidAgg,
    pendingCount,
    recent,
    unreviewed,
    qrScans,
    causeCount,
    failedCount,
  ] = await Promise.all([
    prisma.donation.aggregate({ where: { status: "paid" }, _sum: { amount: true }, _count: true }),
    prisma.donation.count({ where: { status: { in: ["pending", "processing", "requires_action"] } } }),
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { fundType: true, cause: true },
    }),
    prisma.halachicRule.count({ where: { status: { in: ["needs_review", "provisional"] } } }),
    prisma.qrCode.aggregate({ _sum: { scanCount: true } }),
    prisma.cause.count({ where: { active: true } }),
    prisma.donation.count({ where: { status: "failed" } }),
  ]);

  const stats = [
    { label: "סך תרומות שהושלמו", value: formatILS(paidAgg._sum.amount ?? 0) },
    { label: "פעולות שהושלמו", value: String(paidAgg._count) },
    { label: "ממתינות", value: String(pendingCount) },
    { label: "סריקות QR", value: String(qrScans._sum.scanCount ?? 0) },
    { label: "מטרות פעילות", value: String(causeCount) },
    { label: "כשלונות סליקה", value: String(failedCount) },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">סקירה</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 font-display text-2xl">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {unreviewed > 0 && (
        <Card className="border-gold/40">
          <CardBody className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">כללי הלכה הממתינים לעיון</p>
              <p className="text-sm text-muted">
                {unreviewed} כללים בסטטוס needs_review / provisional.
              </p>
            </div>
            <Link href="/admin/halacha" className="text-sm font-medium text-primary">
              לעיון
            </Link>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">תרומות אחרונות</h2>
            <Link href="/admin/finance" className="text-sm text-primary">
              לכל התרומות
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted">אין תרומות עדיין.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-muted">
                    <th className="py-2 pe-3 text-start font-medium">אסמכתא</th>
                    <th className="py-2 pe-3 text-start font-medium">מסלול</th>
                    <th className="py-2 pe-3 text-start font-medium">סכום</th>
                    <th className="py-2 pe-3 text-start font-medium">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((d) => (
                    <tr key={d.id} className="border-b border-border/60">
                      <td className="py-2 pe-3">
                        <Link href={`/admin/finance/${d.id}`} className="num text-primary">
                          {d.publicId}
                        </Link>
                      </td>
                      <td className="py-2 pe-3">{d.fundType.nameHe}</td>
                      <td className="py-2 pe-3 num">{formatILS(d.amount)}</td>
                      <td className="py-2 pe-3">
                        <StatusBadge status={d.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "success"
      : status === "failed"
        ? "danger"
        : "gold";
  const label =
    status === "paid"
      ? "שולם"
      : status === "failed"
        ? "נכשל"
        : "ממתין";
  return <Badge tone={tone}>{label}</Badge>;
}
