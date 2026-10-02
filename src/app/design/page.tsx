"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { ChoiceGroup } from "@/components/ui/choice";
import { AmountPicker } from "@/components/ui/amount-picker";
import { Disclosure } from "@/components/ui/disclosure";
import { Steps } from "@/components/ui/steps";
import { Section, SectionHeading } from "@/components/ui/section";
import { QUICK_AMOUNTS_AGOROT } from "@/lib/money";

export default function DesignPage() {
  const [amount,setAmount] = useState<number | null>(18000);
  const [choice,setChoice] = useState<string | null>("yes");
  return <Section><div className="container-page"><SectionHeading eyebrow="דף דוגמה" title="מערכת העיצוב" lead="רכיבי הממשק במצב בהיר ובמצב כהה." />
    <div className="mt-12 grid gap-8">{["light", "dark"].map(theme => <section key={theme} data-theme={theme} className="border border-border p-8" style={{ background:"var(--color-bg)",color:"var(--color-text)" }}>
      <h2 className="text-center text-2xl">{theme === "light" ? "מצב בהיר" : "מצב כהה"}</h2>
      <div className="mt-8 flex flex-wrap gap-4"><Button>המשך</Button><Button variant="secondary">חזרה</Button><Button variant="ghost">לפרטים</Button><Button disabled>אישור התרומה</Button><Badge>בעיון</Badge></div>
      <div className="mt-8 grid gap-8 md:grid-cols-2"><Card><CardBody><h3 className="text-xl">כרטיס מידע</h3><p className="mt-4 text-muted">תוכן ענייני ומבנה אחיד. הגבול מגדיר את המשטח.</p></CardBody></Card><div><Field label="שם" htmlFor={`name-${theme}`}><Input id={`name-${theme}`} /></Field><Field label="דואר אלקטרוני" htmlFor={`email-${theme}`} className="mt-4"><Input id={`email-${theme}`} type="email" /></Field></div></div>
      <div className="mt-8"><Field label="הערה" htmlFor={`note-${theme}`}><Textarea id={`note-${theme}`} /></Field></div>
      <div className="mt-8"><Steps current={2} total={3} labels={["בחירת הסכום","בחירת היעד","סיכום"]} /></div>
      <div className="mt-8"><ChoiceGroup name={`choice-${theme}`} legend="בחירת המסלול" value={choice} onChange={setChoice} columns={2} options={[{value:"yes",label:"ידוע למי להשיב"},{value:"no",label:"לא ידוע למי להשיב"}]} /></div>
      <div className="mt-8"><AmountPicker presets={QUICK_AMOUNTS_AGOROT} value={amount} onChange={setAmount} /></div>
      <Disclosure summary="להסבר נוסף">הסבר מפורט מוצג לפי בקשה, ללא עומס על המסך הראשי.</Disclosure>
    </section>)}</div>
  </div></Section>;
}
