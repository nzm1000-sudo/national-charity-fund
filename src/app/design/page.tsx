"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { Field, Input, Textarea } from "@/components/ui/form";
import { ChoiceGroup } from "@/components/ui/choice";
import { AmountPicker } from "@/components/ui/amount-picker";
import { Disclosure } from "@/components/ui/disclosure";
import { Steps } from "@/components/ui/steps";
import { CircleSeal } from "@/components/brand/circle-seal";
import { LogoWordmark } from "@/components/brand/logo";

const THEMES = ["light", "dark", "amber"] as const;

export default function DesignPage() {
  const [amount, setAmount] = useState<number | null>(18000);
  const [choice, setChoice] = useState<string | null>("yes");

  return (
    <Section className="pt-12">
      <div className="container-page">
        <div className="rule-gold max-w-2xl">
          <p className="eyebrow">מערכת העיצוב</p>
          <h1 className="mt-3 text-[var(--text-3xl)]">כל הרכיבים, בשלוש הערכות</h1>
          <p className="serif mt-4 text-[var(--text-lg)] text-[var(--color-text-muted)]">
            דף דוגמה פנימי. אותו רכיב בדיוק, בהירה · כהה · ענבר. אין כאן תוכן אמיתי.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {THEMES.map((theme) => (
            <div
              key={theme}
              data-theme={theme}
              className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-6 sm:p-8"
              style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
            >
              <p className="eyebrow mb-6">ערכת {theme}</p>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <LogoWordmark withTagline />
                  <div className="flex flex-wrap items-center gap-3">
                    <Button>כפתור ראשי</Button>
                    <Button variant="secondary">משני</Button>
                    <Button variant="ghost">רפאים</Button>
                    <Button variant="danger">מחיקה</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>נייטרלי</Badge>
                    <Badge tone="primary">מובחן</Badge>
                    <Badge tone="gold">זהב</Badge>
                    <Badge tone="success">הושלם</Badge>
                    <Badge tone="danger">שגיאה</Badge>
                  </div>
                  <Steps current={2} total={3} labels={["פרטים", "סכום", "סיכום"]} />
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardBody>
                      <h3 className="font-display text-lg font-black">כרטיס משטח</h3>
                      <p className="mt-2 text-[var(--text-meta)] text-[var(--color-text-muted)]">
                        שכבה עם גבול בשני גוונים וצל בגוון חום.
                      </p>
                    </CardBody>
                  </Card>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="שם" htmlFor={`n-${theme}`}>
                      <Input id={`n-${theme}`} placeholder="ישראל ישראלי" />
                    </Field>
                    <Field label="טלפון" htmlFor={`p-${theme}`} hint="נשמר רק אם צריך">
                      <Input id={`p-${theme}`} type="tel" placeholder="050-0000000" />
                    </Field>
                  </div>
                  <Field label="הערה" htmlFor={`t-${theme}`}>
                    <Textarea id={`t-${theme}`} placeholder="לא נבקש לתאר מה קרה" />
                  </Field>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <ChoiceGroup
                  name={`c-${theme}`}
                  legend="האם ידוע לך למי שייך הכסף?"
                  value={choice}
                  onChange={setChoice}
                  columns={3}
                  options={[
                    { value: "yes", label: "כן", description: "ידוע לי" },
                    { value: "no", label: "לא", description: "אין מושג" },
                    { value: "unsure", label: "אולי", description: "ספק" },
                  ]}
                />
                <div>
                  <p className="mb-3 font-display text-lg font-black">בחירת סכום</p>
                  <AmountPicker
                    presets={[1800, 3600, 5200, 7200, 10100, 18000, 36000, 50000]}
                    value={amount}
                    onChange={setAmount}
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="border-t border-[var(--color-border)]">
                  <Disclosure summary="להסבר נוסף ולמקורות">
                    ההסברים מבוססים על מקורות שפורסמו. אין להמציא מקורות.
                  </Disclosure>
                </div>
                <div className="grid place-items-center">
                  <CircleSeal count={1000} size={200} alive />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading
            rule
            eyebrow="טיפוגרפיה"
            title="סולם מודולרי 1.25"
            lead="כותרות ראשיות Frank Ruhl Libre 900 · כותרות משנה Noto Serif Hebrew 300 · גוף Heebo."
          />
          <div className="mt-8 space-y-3">
            <p className="text-[var(--text-4xl)]">כותרת 4xl</p>
            <p className="text-[var(--text-3xl)]">כותרת 3xl</p>
            <p className="text-[var(--text-2xl)]">כותרת 2xl</p>
            <h3 className="text-[var(--text-xl)]">כותרת משנה serif</h3>
            <p className="text-[var(--text-base)]">
              גוף טקסט בקריאוּת גבוהה, גובה שורה 1.7, ורוחב שורה עד 68 תווים כדי לשמור על נוחות קריאה.
            </p>
            <p className="num text-[var(--text-2xl)] font-medium">₪1,800,000</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
