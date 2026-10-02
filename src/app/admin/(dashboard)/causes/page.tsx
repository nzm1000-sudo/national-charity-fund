import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/rbac";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleCauseField } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCausesPage() {
  const session = await requirePermission("causes.read");
  const editable = can(session.permissions, "causes.write");

  const [causes, destinations] = await Promise.all([
    prisma.cause.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.fundTypeDestination.findMany({ include: { cause: true }, orderBy: { priority: "desc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">מטרות וקמפיינים</h1>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">מטרות</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pe-3 text-start font-medium">שם</th>
                  <th className="py-2 pe-3 text-start font-medium">slug</th>
                  <th className="py-2 pe-3 text-start font-medium">קטגוריה</th>
                  <th className="py-2 pe-3 text-start font-medium">פעיל</th>
                  <th className="py-2 pe-3 text-start font-medium">גלוי</th>
                  <th className="py-2 pe-3 text-start font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {causes.map((c) => (
                  <tr key={c.id} className="border-b border-border/60">
                    <td className="py-2 pe-3">{c.nameHe}</td>
                    <td className="py-2 pe-3 num text-muted">{c.slug}</td>
                    <td className="py-2 pe-3 text-muted">{c.category}</td>
                    <td className="py-2 pe-3">
                      <Badge tone={c.active ? "success" : "neutral"}>{c.active ? "כן" : "לא"}</Badge>
                    </td>
                    <td className="py-2 pe-3">
                      <Badge tone={c.publicVisible ? "success" : "neutral"}>{c.publicVisible ? "כן" : "לא"}</Badge>
                    </td>
                    <td className="py-2 pe-3">
                      {editable && (
                        <div className="flex gap-2">
                          <form action={toggleCauseField}>
                            <input type="hidden" name="id" value={c.id} />
                            <input type="hidden" name="field" value="active" />
                            <Button size="sm" variant="ghost" type="submit">החלף פעיל</Button>
                          </form>
                          <form action={toggleCauseField}>
                            <input type="hidden" name="id" value={c.id} />
                            <input type="hidden" name="field" value="publicVisible" />
                            <Button size="sm" variant="ghost" type="submit">החלף גלוי</Button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">יעדי הקצאה לפי קופה</h2>
          <p className="mt-1 text-sm text-muted">
            אלו הקישורים שקובעים לאן כל סוג קופה רשאי להקצות כסף. כליעד מוגדר סדר עדיפות.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pe-3 text-start font-medium">קופה</th>
                  <th className="py-2 pe-3 text-start font-medium">יעד</th>
                  <th className="py-2 pe-3 text-start font-medium">מותר</th>
                  <th className="py-2 pe-3 text-start font-medium">עדיפות</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d) => (
                  <tr key={d.id} className="border-b border-border/60">
                    <td className="py-2 pe-3">{d.fundTypeCode}</td>
                    <td className="py-2 pe-3">{d.cause.nameHe}</td>
                    <td className="py-2 pe-3">{d.allowed ? "כן" : "לא"}</td>
                    <td className="py-2 pe-3 num">{d.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
