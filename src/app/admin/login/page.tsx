import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "כניסת מנהלים",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="grid min-h-[70dvh] place-items-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardBody className="p-7">
          <h1 className="font-display text-2xl">ניהול הקופה הלאומית</h1>
          <p className="mt-1 text-sm text-muted">כניסה מורשית בלבד.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
