import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FUND_TYPES } from "@/lib/domain/fund-types";
import { formatILS } from "@/lib/money";
import { requirePermission } from "@/lib/auth/guard";
import { Card, CardBody, Badge } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const STATUSES = ["all", "paid", "pending", "failed", "refunded"] as const;

export default async function AdminFinancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("finance.read");
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "all";
  const fundType = typeof sp.fundType === "string" ? sp.fundType : "all";

  const where: Record<string, unknown> = {};
  if (status !== "all") where.status = status;
  if (fundType !== "all") where.fundTypeCode = fundType;

  const [donations, totals] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { fundType: true, cause: true, receipt: true },
    }),
    prisma.donation.aggregate({ where, _sum: { amount: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl">כספים</h1>
        <p className="text-sm text-muted">
          סה״כ בתצוגה: <span className="num font-medium text-ink">{formatILS(totals._sum.amount ?? 0)}</span>
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <label className="text-sm">
          <span className="me-2 text-muted">סטטוס</span>
          <select name="status" defaultValue={status} className="rounded-md border border-border-strong bg-surface px-3 py-2">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "הכל" : s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="me-2 text-muted">קופה</span>
          <select name="fundType" defaultValue={fundType} className="rounded-md border border-border-strong bg-surface px-3 py-2">
            <option value="all">הכל</option>
            {FUND_TYPES.map((f) => (
              <option key={f.code} value={f.code}>
                {f.nameHe}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-white">
          סינון
        </button>
      </form>

      <Card>
        <CardBody>
          {donations.length === 0 ? (
            <p className="text-sm text-muted">לא נמצאו תרומות.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="py-2 pe-3 text-start font-medium">אסמכתא</th>
                    <th className="py-2 pe-3 text-start font-medium">קופה</th>
                    <th className="py-2 pe-3 text-start font-medium">מטרה</th>
                    <th className="py-2 pe-3 text-start font-medium">סכום</th>
                    <th className="py-2 pe-3 text-start font-medium">סטטוס</th>
                    <th className="py-2 pe-3 text-start font-medium">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-border/60">
                      <td className="py-2 pe-3">
                        <Link href={`/admin/finance/${d.id}`} className="num text-primary">
                          {d.publicId}
                        </Link>
                      </td>
                      <td className="py-2 pe-3">{d.fundType.nameHe}</td>
                      <td className="py-2 pe-3">{d.cause?.nameHe ?? "—"}</td>
                      <td className="py-2 pe-3 num">{formatILS(d.amount)}</td>
                      <td className="py-2 pe-3">
                        <Badge
                          tone={
                            d.status === "paid"
                              ? "success"
                              : d.status === "failed"
                                ? "danger"
                                : d.status === "refunded"
                                  ? "neutral"
                                  : "gold"
                          }
                        >
                          {d.status}
                        </Badge>
                      </td>
                      <td className="py-2 pe-3 text-muted">
                        {new Intl.DateTimeFormat("he-IL", { dateStyle: "short" }).format(d.createdAt)}
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
