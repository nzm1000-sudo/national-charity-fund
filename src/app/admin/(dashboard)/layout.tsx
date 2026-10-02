import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "ניהול",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-4 rounded-md border border-border bg-surface px-3 py-3">
          <p className="text-sm font-medium">{session.name}</p>
          <p className="text-xs text-muted">{session.email}</p>
          <p className="mt-1 text-xs text-muted">תפקיד: {session.role}</p>
        </div>
        <AdminNav permissions={session.permissions} />
        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="text-sm text-muted underline decoration-dotted underline-offset-4 hover:text-danger"
          >
            יציאה
          </button>
        </form>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
