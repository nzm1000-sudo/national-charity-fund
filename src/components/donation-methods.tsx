"use client";

import Image from "next/image";
import { useState } from "react";
import { CreditCard, Phone, Landmark, Copy, Check, ExternalLink, QrCode, Repeat } from "lucide-react";
import { organization } from "@/lib/organization";

export function DonationMethods({ qrDataUrl }: { qrDataUrl: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(organization.bank.account);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return <section className="donation-methods" aria-labelledby="donation-methods-title">
    <div className="home-heading"><p className="eyebrow">הדרך הנוחה לכם</p><h2 id="donation-methods-title">תשלום ויצירת קשר</h2><p>פרטי התשלום והקשר של {organization.name}. לתיאום יעד התרומה או מסלול ההשבה, אפשר לדבר איתנו לפני התשלום.</p></div>
    <div className="payment-method-grid">
      <article className="payment-method"><CreditCard aria-hidden="true" /><h3>אשראי וביט</h3><p>התשלום מתבצע בדף החיצוני של נדרים פלוס, מוסד <bdi>5776132</bdi>.</p><a href={organization.paymentUrl} target="_blank" rel="noopener noreferrer" className="institution-button button-primary">לדף התשלום <ExternalLink size={16} aria-hidden="true" /><span className="sr-only">נפתח בחלון חדש</span></a></article>
      <article className="payment-method payment-qr"><QrCode aria-hidden="true" /><h3>תשלום בסריקה</h3><Image src={qrDataUrl} alt="קוד QR לדף התשלום של ארגון חסד יסובבנו בנדרים פלוס" width={168} height={168} unoptimized /><a href={organization.paymentUrl} target="_blank" rel="noopener noreferrer">פתיחת קישור התשלום <ExternalLink size={15} aria-hidden="true" /><span className="sr-only">נפתח בחלון חדש</span></a></article>
      <article className="payment-method"><Landmark aria-hidden="true" /><h3>העברה בנקאית</h3><dl className="bank-details"><div><dt>בנק</dt><dd>{organization.bank.name}</dd></div><div><dt>סניף</dt><dd><bdi>{organization.bank.branch}</bdi></dd></div><div><dt>חשבון</dt><dd><bdi>{organization.bank.account}</bdi><button type="button" onClick={() => void copyAccount()} className="bank-copy" aria-label="העתקת מספר חשבון" title="העתקת מספר חשבון">{copyState === "copied" ? <Check size={17} /> : <Copy size={17} />}</button></dd></div></dl><p role="status" className="copy-status">{copyState === "copied" ? "מספר החשבון הועתק" : copyState === "failed" ? "לא ניתן להעתיק אוטומטית. מספר החשבון: 294319." : "לתיאום קבלה ושיוך ההעברה, פנו לארגון."}</p></article>
      <article className="payment-method"><Phone aria-hidden="true" /><h3>מדברים איתנו</h3><p>לתשלום טלפוני, קבלות, בירור מסלול ושאלות על הפעילות.</p><div className="contact-phones">{organization.phones.map(phone => <a key={phone.href} href={phone.href}><Phone size={16} aria-hidden="true" /><bdi>{phone.display}</bdi></a>)}</div><p>{organization.city}</p></article>
    </div>
    <section id="standing-order" className="public-needs-note" aria-labelledby="standing-order-title"><Repeat size={28} aria-hidden="true" /><div><h3 id="standing-order-title">הוראת קבע לנתינה מתמשכת</h3><p>אפשר להגדיר בבנק העברה חודשית קבועה לחשבון הארגון: {organization.bank.name}, סניף <bdi>{organization.bank.branch}</bdi>, חשבון <bdi>{organization.bank.account}</bdi>. בוחרים סכום ומועד שמתאימים לכם, ומתאמים עם הארגון את הקופה, היעד והקבלה. ההקמה, השינוי והביטול נעשים בבנק או מול הארגון, לא בטופס האתר.</p></div><a href={organization.phones[0].href} className="institution-button button-secondary"><Phone size={16} aria-hidden="true" />לתיאום הוראת קבע</a></section>
    <div className="payment-disclaimer"><p>תשלום בנדרים פלוס או בהעברה בנקאית אינו מעדכן אוטומטית את נתוני התרומות באתר זה. כדי לשמור על הייעוד שבחרתם, יש לתאם עם הארגון את הקופה והמסלול ולקבל אישור על השיוך. פרטי כרטיס האשראי אינם נמסרים לאתר זה.</p><p>{organization.taxNote}</p></div>
  </section>;
}