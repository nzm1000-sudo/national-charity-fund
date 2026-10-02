import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/rbac";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleAdminActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSystemPage() {
  const session = await requirePermission("system.read");
  const editable = can(session.permissions, "system.write");

  const [users, roles, settings, audit] = await Promise.all([
    prisma.adminUser.findMany({ include: { role: true }, orderBy: { createdAt: "asc" } }),
    prisma.role.findMany({ orderBy: { code: "asc" } }),
    prisma.setting.findMany({ orderBy: { key: "asc" } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 40, include: { actor: true } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">מערכת</h1>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">משתמשי ניהול</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pe-3 text-start font-medium">שם</th>
                  <th className="py-2 pe-3 text-start font-medium">אימייל</th>
                  <th className="py-2 pe-3 text-start font-medium">תפקיד</th>
                  <th className="py-2 pe-3 text-start font-medium">פעיל</th>
                  {editable && <th className="py-2 pe-3"></th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/60">
                    <td className="py-2 pe-3">{u.name}</td>
                    <td className="py-2 pe-3 text-muted">{u.email}</td>
                    <td className="py-2 pe-3">{u.role?.nameHe ?? "—"}</td>
                    <td className="py-2 pe-3">
                      <Badge tone={u.active ? "success" : "neutral"}>{u.active ? "כן" : "לא"}</Badge>
                    </td>
                    {editable && (
                      <td className="py-2 pe-3">
                        <form action={toggleAdminActive}>
                          <input type="hidden" name="id" value={u.id} />
                          <Button size="sm" variant="ghost" type="submit">החלף</Button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-display text-lg">תפקידים והרשאות</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {roles.map((r) => (
                <li key={r.id} className="border-b border-border/60 pb-2">
                  <p className="font-medium">{r.nameHe} <span className="num text-xs text-muted">({r.code})</span></p>
                  <p className="mt-1 text-xs text-muted num" dir="ltr">
                    {(JSON.parse(r.permissions) as string[]).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-display text-lg">הגדרות</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {settings.map((s) => (
                <li key={s.key} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <span className="num text-xs text-muted" dir="ltr">{s.key}</span>
                  <span className="max-w-[55%] truncate text-end">{JSON.parse(s.value)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">יומן ביקורת</h2>
          <p className="mt-1 text-sm text-muted">רשומה בלתי-ניתנת לשינוי של פעולות רגישות.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pe-3 text-start font-medium">פעולה</th>
                  <th className="py-2 pe-3 text-start font-medium">יישות</th>
                  <th className="py-2 pe-3 text-start font-medium">מבצע</th>
                  <th className="py-2 pe-3 text-start font-medium">זמן</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((a) => (
                  <tr key={a.id} className="border-b border-border/60">
                    <td className="py-2 pe-3 num text-xs" dir="ltr">{a.action}</td>
                    <td className="py-2 pe-3 text-muted">{a.entity}</td>
                    <td className="py-2 pe-3">{a.actor?.email ?? "—"}</td>
                    <td className="py-2 pe-3 num text-xs text-muted">
                      {new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(a.createdAt)}
                    </td>
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
