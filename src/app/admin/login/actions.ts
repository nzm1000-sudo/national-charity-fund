"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth/session";
import { rolePermissions } from "@/lib/rbac";
import { adminLoginSchema } from "@/lib/validation";
import { recordAudit } from "@/server/audit";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.ok) {
    return { error: "יותר מדי ניסיונות התחברות. נסו שוב בעוד דקה." };
  }

  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "פרטי התחברות אינם תקינים." };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
    include: { role: true },
  });

  const genericError = { error: "אימייל או סיסמה שגויים." };
  if (!user || !user.active) return genericError;
  if (!verifyPassword(parsed.data.password, user.passwordHash)) return genericError;

  const permissions = rolePermissions(user.role?.code ?? "viewer");
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role?.code ?? "viewer",
    permissions,
  });
  await setSessionCookie(token);

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await recordAudit({
    actorId: user.id,
    action: "admin.login",
    entity: "AdminUser",
    entityId: user.id,
    ip,
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
