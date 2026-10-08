"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AmountPicker } from "@/components/ui/amount-picker";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Label } from "@/components/ui/form";
import { formatILS, parseAmountToAgorot } from "@/lib/money";
import { FormStages } from "@/components/ui/form-stages";
import { organization } from "@/lib/organization";

export interface DonationFormFund {
  code: string;
  nameHe: string;
  minAmountAgorot: number;
  suggestedAmounts: number[];
  anonymousAllowed: boolean;
  receiptRequired: boolean;
  destinations: Array<{ causeId: string; nameHe: string; slug: string }>;
}

export interface DonationFormProps {
  fund: DonationFormFund;
  mode?: "tzedakah" | "maaser" | "pidyon" | "public_needs" | "restitution";
  showCause?: boolean;
  showPidyon?: boolean;
  showMaaserCalc?: boolean;
  defaultCauseSlug?: string;
  qrId?: string;
}

const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

export function DonationForm(props: DonationFormProps) {
  return (
     <Suspense fallback={<div className="h-40 rounded-card bg-surface-2" aria-label="טעינת הטופס" />}>
      <DonationFormInner {...props} />
    </Suspense>
  );
}

function DonationFormInner({
  fund,
  mode = "tzedakah",
  showCause = true,
  showPidyon = false,
  showMaaserCalc = false,
  defaultCauseSlug,
  qrId,
}: DonationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("src") ?? undefined;
  const [amount, setAmount] = useState<number | null>(() => {
    const requested = searchParams.get("amount");
    if (!requested || !/^\d+(\.\d{1,2})?$/.test(requested)) return null;
    const parsed = parseAmountToAgorot(requested);
    return parsed != null && parsed >= fund.minAmountAgorot && parsed <= 100000000 ? parsed : null;
  });
  const [causeId, setCauseId] = useState<string>(
    fund.destinations.find((d) => d.slug === defaultCauseSlug)?.causeId ??
      fund.destinations[0]?.causeId ??
      "",
  );
  const [anonymous, setAnonymous] = useState(mode === "restitution");
  const [discreet, setDiscreet] = useState(mode === "restitution");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [dedication, setDedication] = useState("");
  const [pName, setPName] = useState("");
  const [pMother, setPMother] = useState("");
  const [pRequest, setPRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = amount != null && amount >= fund.minAmountAgorot && !submitting;

  async function submit() {
    if (!canSubmit || amount == null) return;
    setSubmitting(true);
    setError(null);

    if (STATIC_DEMO) {
      // Static GitHub Pages build has no server: the real payment happens on the organization's Nedarim Plus donation page.
      const destination = showCause ? fund.destinations.find((d) => d.causeId === causeId)?.nameHe : undefined;
      const pidyon = showPidyon && (pName || pRequest)
        ? `פדיון נפש: ${[pName, pMother && `בן/בת ${pMother}`].filter(Boolean).join(" ")}${pRequest ? ` — ${pRequest}` : ""}`
        : "";
      const note = [fund.nameHe, destination, pidyon, designation, dedication].filter(Boolean).join(" · ");
      const handoff = new URLSearchParams({ amount: String(Math.round(amount / 100)) });
      if (!anonymous && name.trim()) handoff.set("name", name.trim());
      if (phone.trim()) handoff.set("phone", phone.trim());
      if (email.trim()) handoff.set("mail", email.trim());
      if (note) handoff.set("comment", note.slice(0, 250));
      window.location.href = `${organization.paymentUrl}#${handoff}`;
      return;
    }

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fundType: fund.code,
          amountAgorot: amount,
          causeId: causeId || null,
          qrId: qrId || null,
          donorName: anonymous ? undefined : name || undefined,
          donorEmail: email || undefined,
          donorPhone: phone || undefined,
          anonymous,
          diligentDiscretion: discreet,
          designation: designation || undefined,
          dedication: dedication || undefined,
          source: source || undefined,
          pidyon: showPidyon
            ? { name: pName || undefined, motherName: pMother || undefined, request: pRequest || undefined }
            : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "לא הצלחנו להשלים את התשלום. לא חויבת. אפשר לנסות שוב.");
        setSubmitting(false);
        return;
      }
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl as string;
      } else {
        router.push(`/donation/${data.publicId}`);
      }
    } catch {
      setError("לא ניתן להשלים את הפעולה עקב תקלה בחיבור. אפשר לנסות שוב.");
      setSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <FormStages labels={["בחירת הסכום", "בחירת היעד", "פרטים וסיכום"]}>
      <div>
      {/* Amount */}
      <section aria-labelledby="amount-heading">
        <h2 id="amount-heading" className="font-display text-lg font-medium">
          {showPidyon ? "סכום הפדיון" : "סכום"}
        </h2>
        <div className="mt-4">
          <AmountPicker
            presets={fund.suggestedAmounts}
            value={amount}
            onChange={setAmount}
            minAgorot={fund.minAmountAgorot}
          />
        </div>
      </section>

      {showMaaserCalc && <MaaserHelper onApply={setAmount} />}
      </div>
      <div>

      {/* Cause */}
      {showCause && fund.destinations.length > 0 && (
        <section aria-labelledby="cause-heading">
          <h2 id="cause-heading" className="font-display text-lg font-medium">
            יעד התרומה
          </h2>
          <p className="mt-1 text-sm text-muted">
            בחירת היעד נעשית מתוך היעדים המותרים לקופה זו.
          </p>
          <div className="mt-3">
            <Label htmlFor="cause">יעד התרומה</Label>
            <select
              id="cause"
              value={causeId}
              onChange={(e) => setCauseId(e.target.value)}
              className="mt-2 block w-full rounded-card border border-border-strong bg-surface px-4 py-3 text-base"
            >
              {fund.destinations.map((d) => (
                <option key={d.causeId} value={d.causeId}>
                  {d.nameHe}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      {/* Pidyon-specific */}
      {showPidyon && (
        <section aria-labelledby="pidyon-heading" className="rounded-card border border-border bg-surface-2 p-5">
          <h2 id="pidyon-heading" className="font-display text-lg font-medium">
            פרטי הפדיון
          </h2>
          <p className="mt-1 text-sm text-muted">
            אפשר לציין את שם האדם ואת שם אמו לצורך הבקשה. השדות אינם חובה.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="שם האדם" htmlFor="p-name">
              <Input id="p-name" value={pName} onChange={(e) => setPName(e.target.value)} maxLength={120} />
            </Field>
            <Field label="שם האם" htmlFor="p-mother">
              <Input id="p-mother" value={pMother} onChange={(e) => setPMother(e.target.value)} maxLength={120} />
            </Field>
          </div>
          <Field label="מטרת הבקשה" htmlFor="p-request" className="mt-4">
            <Textarea id="p-request" value={pRequest} onChange={(e) => setPRequest(e.target.value)} maxLength={300} placeholder="למשל: לרפואה שלמה, לזיווג, לפרנסה…" />
          </Field>
        </section>
      )}

      {!showCause && !showPidyon && <p>הממון מיועד לקופת צרכי רבים, בהתאם למסלול ההשבה שנבחר.</p>}
      </div>
      <div>

      {/* Details */}
      <section aria-labelledby="details-heading">
        <h2 id="details-heading" className="font-display text-lg font-medium">
          פרטים
        </h2>

        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-md border border-border bg-surface p-4">
            <input
              type="checkbox"
              checked={discreet}
              onChange={(e) => {
                setDiscreet(e.target.checked);
                if (e.target.checked) setAnonymous(true);
              }}
              className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
            />
            <span>
              <span className="block font-medium text-ink">מצב צנעה</span>
              <span className="mt-0.5 block text-sm text-muted">
                ללא מעקב וללא עוגיות שיווקיות. נשמר רק המידע ההכרחי לביצוע הפעולה.
              </span>
            </span>
          </label>

          {fund.anonymousAllowed && (
            <label className="flex items-start gap-3 rounded-md border border-border bg-surface p-4">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className="block font-medium text-ink">תרומה בעילום שם</span>
                <span className="mt-0.5 block text-sm text-muted">
                  השם לא יוצג. ככל שנדרשת קבלה, יידרשו רק הפרטים ההכרחיים.
                </span>
              </span>
            </label>
          )}
        </div>

        {(!anonymous || fund.receiptRequired) && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {!anonymous && (
              <Field label="שם" htmlFor="d-name">
                <Input id="d-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoComplete="name" />
              </Field>
            )}
            <Field label={fund.receiptRequired ? "דואר אלקטרוני (לקבלה)" : "דואר אלקטרוני (רשות)"} htmlFor="d-email">
              <Input id="d-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} autoComplete="email" />
            </Field>
            <Field label="טלפון (רשות)" htmlFor="d-phone">
              <Input id="d-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} autoComplete="tel" />
            </Field>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="הקדשה (רשות)" htmlFor="d-designation">
            <Input id="d-designation" value={designation} onChange={(e) => setDesignation(e.target.value)} maxLength={200} placeholder="למשל: לעילוי נשמת…" />
          </Field>
          <Field label="הקדשה אישית (רשות)" htmlFor="d-dedication">
            <Input id="d-dedication" value={dedication} onChange={(e) => setDedication(e.target.value)} maxLength={300} />
          </Field>
        </div>
      </section>

      {/* Summary + submit */}
      <section className="rounded-card border border-border bg-surface p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-meta">
          <span className="text-ink-soft">סכום התרומה</span>
          <span className="num text-xl">
            {amount != null ? formatILS(amount) : "לא נבחר סכום"}
          </span>
        </div>
        {error && (
          <p className="mt-3 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth className="mt-4" disabled={!canSubmit}>
          {submitting ? "מעבר לתשלום…" : STATIC_DEMO ? "המשך לתשלום מאובטח" : "אישור התרומה"}
        </Button>
        <p className="mt-2 text-center text-xs text-muted">
          {STATIC_DEMO
            ? "התשלום יושלם בדף התרומה המאובטח של הארגון (נדרים פלוס), עם הסכום והפרטים שמילאתם."
            : "לא נשמרים מספר כרטיס מלא או קוד האימות שלו."}
        </p>
      </section>
      </div>
      </FormStages>
    </form>
  );
}

function MaaserHelper({ onApply }: { onApply: (agorot: number) => void }) {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [other, setOther] = useState("");

  const suggested = useMemo(() => {
    const inc = parseAmountToAgorot(income) ?? 0;
    const exp = parseAmountToAgorot(expenses) ?? 0;
    const oth = parseAmountToAgorot(other) ?? 0;
    const base = Math.max(inc + oth - exp, 0);
    return Math.round(base * 0.1);
  }, [income, expenses, other]);

  return (
    <section
      aria-labelledby="maaser-heading"
      className="rounded-card border border-border bg-surface-2 p-5"
    >
      <h2 id="maaser-heading" className="font-display text-lg font-medium">
        מחשבון מעשר (רשות)
      </h2>
      <p className="mt-1 text-sm text-muted">
        החישוב מבוסס על ההכנסות וההוצאות המוזנות, בהתאם לכלל הקיים במערכת.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="הכנסה חודשית" htmlFor="m-income">
          <Input id="m-income" inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="₪" />
        </Field>
        <Field label="הוצאות (רשות)" htmlFor="m-expenses">
          <Input id="m-expenses" inputMode="decimal" value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="₪" />
        </Field>
        <Field label="הכנסות נוספות (רשות)" htmlFor="m-other">
          <Input id="m-other" inputMode="decimal" value={other} onChange={(e) => setOther(e.target.value)} placeholder="₪" />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-ink-soft">
          מעשר:{" "}
          <span className="num block text-3xl text-ink">
            {suggested > 0 ? formatILS(suggested) : "לא הוזנה הכנסה"}
          </span>
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={suggested <= 0}
          onClick={() => onApply(suggested)}
        >
          בחירת הסכום המחושב
        </Button>
      </div>
      <p className="mt-6 text-meta">חומש: <bdi className={suggested > 0 ? "block text-3xl" : "block text-base"}>{suggested > 0 ? formatILS(suggested * 2) : "לא הוזנה הכנסה"}</bdi></p>
    </section>
  );
}
