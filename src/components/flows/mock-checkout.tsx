"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { formatILS } from "@/lib/money";

export function MockCheckout({
  reference,
  amountAgorot,
  returnUrl,
}: {
  reference: string;
  amountAgorot: number;
  returnUrl: string;
}) {
  const [busy, setBusy] = useState<null | "success" | "fail">(null);
  const [error, setError] = useState<string | null>(null);

  async function pay(outcome: "success" | "fail") {
    setBusy(outcome);
    setError(null);
    try {
      const res = await fetch("/api/mock/pay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ref: reference, outcome }),
      });
      if (!res.ok) throw new Error("failed");
      window.location.href = returnUrl;
    } catch {
      setError("הדמיית התשלום נכשלה. נסו שוב.");
      setBusy(null);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardBody>
        <p className="text-sm text-muted">סביבת פיתוח · ספק סליקה לדוגמה</p>
        <h1 className="mt-2 font-display text-2xl">הדמיית תשלום</h1>
        <p className="mt-2 text-sm text-ink-soft">
          זהו דף סליקה מדומה לפיתוח בלבד. לא מבוצע חיוב אמיתי.
        </p>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">אסמכתא</dt>
            <dd className="num">{reference}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">סכום</dt>
            <dd className="font-medium">{formatILS(amountAgorot)}</dd>
          </div>
        </dl>
        {error && (
          <p className="mt-3 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="mt-5 space-y-2">
          <Button fullWidth size="lg" disabled={!!busy} onClick={() => pay("success")}>
            {busy === "success" ? "מאשר…" : "אישור התשלום"}
          </Button>
          <Button
            fullWidth
            variant="ghost"
            disabled={!!busy}
            onClick={() => pay("fail")}
          >
            הדמיית כישלון
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
