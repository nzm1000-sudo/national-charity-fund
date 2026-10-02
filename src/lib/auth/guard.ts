import { redirect } from "next/navigation";
import { getSession, type SessionClaims } from "@/lib/auth/session";
import { can, type Permission } from "@/lib/rbac";

/** For server components / route handlers: ensures an admin session. */
export async function requireAdmin(): Promise<SessionClaims> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requirePermission(
  permission: Permission,
): Promise<SessionClaims> {
  const session = await requireAdmin();
  if (!can(session.permissions, permission)) {
    redirect("/admin?denied=1");
  }
  return session;
}

/** Non-redirecting variant for API routes. */
export async function getAdminOrNull(): Promise<SessionClaims | null> {
  const session = await getSession();
  return session;
}
