import Link from "next/link";
import { Emblem } from "./Emblem";

const paths = [["/hashavat-mamon", "השבת ממון"], ["/tzrachei-rabim", "צרכי רבים"], ["/maaser", "מעשר כספים"], ["/tzedakah", "צדקה"], ["/pidyon", "פדיון נפש"]];
const info = [["/where-the-money-goes", "לאן מגיעה התרומה"], ["/faq", "שאלות ותשובות"], ["/privacy", "מדיניות פרטיות"], ["/about", "אודות העמותה"], ["/accessibility", "הצהרת נגישות"]];

export function SiteFooter() {
  return <footer className="border-t border-border bg-surface-2">
    <div className="container-page grid gap-8 py-16 md:grid-cols-4">
      <div><Emblem size={48} /><h2 className="mt-4 font-display text-xl">הקופה הלאומית</h2><p className="serif mt-4 text-meta text-muted">להשיב, לתקן ולתת</p></div>
      <div><h2 className="font-display text-xl">מסלולים</h2><ul className="mt-4">{paths.map(([href,label]) => <li key={href}><Link className="inline-flex min-h-11 items-center text-meta text-muted" href={href}>{label}</Link></li>)}</ul></div>
      <div><h2 className="font-display text-xl">שקיפות</h2><ul className="mt-4">{info.map(([href,label]) => <li key={href}><Link className="inline-flex min-h-11 items-center text-meta text-muted" href={href}>{label}</Link></li>)}</ul></div>
      <div><h2 className="font-display text-xl">חשוב לדעת</h2><p className="mt-4 text-meta text-muted">ההסברים מבוססים על מקורות הלכתיים מתועדים. במקרה אישי מורכב יש להתייעץ עם רב פוסק. איננו שומרים תיאור של מה שאירע.</p></div>
    </div>
    <div className="border-t border-border"><div className="container-page py-8 text-center text-meta text-muted">
      <p className="mx-auto">הקופה הלאומית פועלת במסגרת עמותת חסד יסובבנו (ע&quot;ר <bdi>580509396</bdi>), בנשיאות הרב שלום יוסף ברבי, נתיבות.</p>
      <p className="mx-auto mt-4">© <bdi>2026</bdi> הקופה הלאומית · ללא מעקב במצב צנעה</p>
    </div></div>
  </footer>;
}
