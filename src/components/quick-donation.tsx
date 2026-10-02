"use client";

import { useState } from "react";
import { ArrowLeft, Heart, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function QuickDonation() {
  const [amount, setAmount] = useState("1200");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const valid = /^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) >= 1 && Number(amount) <= 1000000;

  return <section className="quick-donation" aria-labelledby="quick-donation-title">
    <div className="quick-donation-heading"><Heart aria-hidden="true" /><div><h2 id="quick-donation-title">הנתינה שלך מתחילה כאן</h2><p>בכל עת, לפי היכולת. למטרה הקרובה ללב.</p></div></div>
    <fieldset className="quick-frequency"><legend className="sr-only">אופן הנתינה</legend><label><input type="radio" name="quick-frequency" value="once" checked={frequency === "once"} onChange={() => setFrequency("once")} />תרומה כעת</label><label><input type="radio" name="quick-frequency" value="monthly" checked={frequency === "monthly"} onChange={() => setFrequency("monthly")} />הוראת קבע</label></fieldset>
    <fieldset className="quick-amounts"><legend className="sr-only">בחירת סכום בשקלים</legend>{[54, 180, 360, 720].map(value => <button key={value} type="button" aria-pressed={amount === String(value)} onClick={() => setAmount(String(value))}><bdi>{value} ₪</bdi></button>)}</fieldset>
    <div className="quick-donation-action"><label htmlFor="quick-amount">סכום אחר <span className="quick-input"><input id="quick-amount" inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} aria-invalid={!valid} aria-describedby={!valid ? "quick-amount-error" : undefined} /><span>₪</span></span></label><ButtonLink href={valid ? frequency === "monthly" ? "#standing-order" : `/tzedakah?amount=${encodeURIComponent(amount)}` : "#quick-amount"} onClick={event => { if (!valid) { event.preventDefault(); document.getElementById("quick-amount")?.focus(); } }}>{frequency === "monthly" ? "לסידור הוראת קבע" : "ממשיכים לתרומה"} <ArrowLeft size={18} aria-hidden="true" /></ButtonLink></div>
    {frequency === "monthly" && <p className="quick-note">הוראת הקבע מוגדרת בבנק או מול הארגון. בחירה כאן אינה יוצרת חיוב.</p>}
    {!valid && <p id="quick-amount-error" role="alert">יש להזין סכום בין 1 ל־1,000,000 ₪, עד שתי ספרות אחרי הנקודה.</p>}
    <p className="quick-note"><ShieldCheck size={16} aria-hidden="true" /> אפשר לתרום בעילום שם. הפרטים נשארים לבחירתכם.</p>
  </section>;
}