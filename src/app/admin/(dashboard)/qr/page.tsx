import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/rbac";
import { env } from "@/lib/env";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { createQrCode, toggleQrCode } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminQrPage() {
  const session = await requirePermission("qr.read");
  const editable = can(session.permissions, "qr.write");

  const qrs = await prisma.qrCode.findMany({
    orderBy: { createdAt: "desc" },
    include: { cause: true, campaign: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">מנוע QR</h1>
      <p className="text-sm text-muted">
        כל QR מפנה לכתובת מקוצרת שבבעלותנו, ומשם מנותב עם ספירה ללא זיהוי אישי.
        ניתן להוריד PNG/SVG להדפסה.
      </p>

      {editable && (
        <Card>
          <CardBody>
            <h2 className="font-display text-lg">יצירת QR חדש</h2>
            <form action={createQrCode} className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="slug" htmlFor="slug" hint="אותיות קטנות, מספרים ומקף">
                <Input id="slug" name="slug" dir="ltr" placeholder="restore-2" required />
              </Field>
              <Field label="יעד" htmlFor="destination" hint="נתיב פנימי, למשל /hashavat-mamon">
                <Input id="destination" name="destination" dir="ltr" placeholder="/hashavat-mamon" required />
              </Field>
              <Field label="מקור (רשות)" htmlFor="source">
                <Input id="source" name="source" placeholder="beit-knesset" />
              </Field>
              <div className="sm:col-span-3">
                <Button type="submit">יצירה</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pe-3 text-start font-medium">slug</th>
                  <th className="py-2 pe-3 text-start font-medium">יעד</th>
                  <th className="py-2 pe-3 text-start font-medium">סריקות</th>
                  <th className="py-2 pe-3 text-start font-medium">פעיל</th>
                  <th className="py-2 pe-3 text-start font-medium">הורדה</th>
                  {editable && <th className="py-2 pe-3 text-start font-medium"></th>}
                </tr>
              </thead>
              <tbody>
                {qrs.map((q) => (
                  <tr key={q.id} className="border-b border-border/60">
                    <td className="py-2 pe-3 num">{q.slug}</td>
                    <td className="py-2 pe-3 num text-muted" dir="ltr">{q.destination}</td>
                    <td className="py-2 pe-3 num">{q.scanCount}</td>
                    <td className="py-2 pe-3">
                      <Badge tone={q.active ? "success" : "neutral"}>{q.active ? "כן" : "לא"}</Badge>
                    </td>
                    <td className="py-2 pe-3">
                      <div className="flex gap-2 text-xs">
                        <a className="text-primary" href={`/api/qr/${q.code}?format=svg`}>SVG</a>
                        <a className="text-primary" href={`/api/qr/${q.code}?format=png`}>PNG</a>
                      </div>
                    </td>
                    {editable && (
                      <td className="py-2 pe-3">
                        <form action={toggleQrCode}>
                          <input type="hidden" name="id" value={q.id} />
                          <Button size="sm" variant="ghost" type="submit">
                            {q.active ? "השבת" : "הפעל"}
                          </Button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted num" dir="ltr">
            {env.APP_URL}/q/[slug]
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
