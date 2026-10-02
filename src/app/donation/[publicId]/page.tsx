import { notFound } from "next/navigation";
import Link from "next/link";
import { getDonationByPublicId } from "@/server/donations";
import { env } from "@/lib/env";
import { getFundType } from "@/lib/domain/fund-types";
import { formatILS } from "@/lib/money";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { IconCheck } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "סיכום פעולה", robots: { index: false } };

const THANKS: Record<string, string> = {
  tzedakah: "תודה שהיית שותף לעזרה. הנתינה שלך תגיע למי שזקוק לה.",
  maaser: "תודה שהפרשת מעשר. נשמור על רצף ואפשר יהיה לחזור בקלות.",
  public_needs: "תודה. הכסף יופנה לדברים שהציבור נהנה מהם — באופן מתמשך ומכובד.",
  pidyon_nefesh: "הפדיון נרשם. נעשה את המעשה ככל האפשר לפי המנהג.",
  restitution: "הפעולה נרשמה בשקט. עשית את מה שאפשר כדי לתקן — וזה העיקר.",
  general: "תודה. נדאג שהתרומה תגיע למקום המתאים.",
};

export default async function DonationStatusPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const donation = await getDonationByPublicId(publicId);
  if (!donation) notFound();

  const fundDef = getFundType(donation.fundTypeCode);
  const paid = donation.status === "paid";
  const failed = donation.status === "failed";

  const mockPayHref =
    env.PAYMENTS_PROVIDER === "mock" && donation.providerRef
      ? `/mock/pay?ref=${encodeURIComponent(donation.providerRef)}&amount=${donation.amount}&return=${encodeURIComponent(
          `${env.APP_URL}/donation/${donation.publicId}`,
        )}`
      : null;

  return (
    <Section className="pt-12">
      <div className="container-page max-w-2xl">
        <Card className={paid ? "border-success/40" : undefined}>
          <CardBody className="p-7">
            {paid ? (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-success-soft text-success">
                  <IconCheck />
                </span>
                <h1 className="mt-4 font-display text-3xl">
                  הפעולה הושלמה בהצלחה
                </h1>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
                  {THANKS[donation.fundTypeCode] ?? THANKS.general}
                </p>
              </>
            ) : failed ? (
              <>
                <Badge tone="danger">התשלום לא הושלם</Badge>
                <h1 className="mt-4 font-display text-3xl">לא הצלחנו להשלים את התשלום</h1>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
                  לא חויבת. אפשר לנסות שוב, והפרטים נשמרו.
                </p>
              </>
            ) : (
              <>
                <Badge tone="gold">ממתין לאישור</Badge>
                <h1 className="mt-4 font-display text-3xl">התשלום ממתין להשלמה</h1>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
                  אם התשלום לא הושלם, אפשר לחזור אליו מהקישור למטה.
                </p>
              </>
            )}

            <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">מסלול</dt>
                <dd>{fundDef?.nameHe ?? donation.fundTypeCode}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">סכום</dt>
                <dd className="font-medium">{formatILS(donation.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">אסמכתא</dt>
                <dd className="num">{donation.publicId}</dd>
              </div>
              {donation.receipt && (
                <div className="flex justify-between">
                  <dt className="text-muted">קבלה</dt>
                  <dd className="num">{donation.receipt.number}</dd>
                </div>
              )}
              {donation.cause && (
                <div className="flex justify-between">
                  <dt className="text-muted">מטרה</dt>
                  <dd>{donation.cause.nameHe}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              {!paid && mockPayHref && (
                <ButtonLink href={mockPayHref}>להשלמת התשלום</ButtonLink>
              )}
              <ButtonLink href="/where-the-money-goes" variant="secondary">
                לאן הכסף מגיע
              </ButtonLink>
              <Link
                href="/"
                className="inline-flex items-center px-2 text-sm text-muted hover:text-primary"
              >
                חזרה לדף הבית
              </Link>
            </div>
          </CardBody>
        </Card>

        <p className="mt-4 text-center text-xs text-muted">
          שמרו את מספר האסמכתא. לא נשמרו פרטי כרטיס.
        </p>
      </div>
    </Section>
  );
}
