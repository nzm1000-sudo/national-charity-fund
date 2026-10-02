import Link from "next/link";
import { Emblem } from "./Emblem";
import { organization } from "@/lib/organization";

const paths = [["/hashavat-mamon", "השבת ממון"], ["/tzrachei-rabim", "צרכי רבים"], ["/maaser", "מעשר כספים"], ["/tzedakah", "צדקה"], ["/pidyon", "פדיון נפש"]];
const info = [["/where-the-money-goes", "לאן מגיעה התרומה"], ["/faq", "שאלות ותשובות"], ["/privacy", "מדיניות פרטיות"], ["/about", "אודות הארגון"], ["/accessibility", "הצהרת נגישות"]];

export function SiteFooter() {
  return <footer className="site-footer border-t border-border bg-surface-2">
    <div className="container-page grid gap-8 py-16 md:grid-cols-4">
      <div><Emblem size={140} /><h2 className="mt-4 font-display text-xl">ארגון חסד יסובבנו</h2><p className="serif mt-4 text-meta text-muted">הקופה הלאומית · להשיב, לתת ולתקן</p></div>
      <div><h2 className="font-display text-xl">מסלולים</h2><ul className="mt-4">{paths.map(([href,label]) => <li key={href}><Link className="inline-flex min-h-11 items-center text-meta text-muted" href={href}>{label}</Link></li>)}</ul></div>
      <div><h2 className="font-display text-xl">שקיפות</h2><ul className="mt-4">{info.map(([href,label]) => <li key={href}><Link className="inline-flex min-h-11 items-center text-meta text-muted" href={href}>{label}</Link></li>)}</ul></div>
      <div><h2 className="font-display text-xl">יצירת קשר</h2><div className="contact-phones mt-4">{organization.phones.map(phone => <a key={phone.href} href={phone.href}><bdi>{phone.display}</bdi></a>)}</div><p className="text-meta text-muted">{organization.city}</p><Link href="/#payment-and-contact" className="inline-flex min-h-11 items-center text-meta text-link">פרטי תשלום והעברה בנקאית</Link><p className="mt-4 text-meta text-muted">במקרה אישי מורכב יש להתייעץ עם רב פוסק. איננו שומרים תיאור של מה שאירע.</p></div>
    </div>
    <div className="border-t border-border"><div className="container-page py-8 text-center text-meta text-muted">
      <p className="mx-auto">הקופה הלאומית פועלת במסגרת ארגון ״חסד יסובבנו״ (ע&quot;ר <bdi>580509396</bdi>), בנשיאות הרב שלום יוסף ברבי, נתיבות.</p>
      <p className="mx-auto mt-4">© <bdi>2026</bdi> הקופה הלאומית</p>
    </div></div>
  </footer>;
}
