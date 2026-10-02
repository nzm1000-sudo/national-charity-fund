import Link from "next/link";
import { HALACHIC_DISCLAIMER_HE } from "@/lib/domain/halachic-rules-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-lg font-semibold">הקופה הלאומית</p>
          <p className="mt-1 text-sm text-muted">להשיב, לתקן ולתת</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            הקופה הלאומית מופעלת באמצעות עמותת חסד יסובבנו, בנשיאות הרב שלום יוסף
            ברבי, נתיבות.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">מסלולים</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-ink-soft hover:text-primary" href="/hashavat-mamon">השבת ממון</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/tzrachei-rabim">צרכי רבים</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/maaser">מעשר כספים</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/tzedakah">צדקה</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/pidyon">פדיון נפש</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">שקיפות</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-ink-soft hover:text-primary" href="/where-the-money-goes">לאן הכסף מגיע?</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/faq">שאלות נפוצות</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/privacy">פרטיות</Link></li>
            <li><Link className="text-ink-soft hover:text-primary" href="/about">אודות העמותה</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">חשוב לדעת</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {HALACHIC_DISCLAIMER_HE}
          </p>
          <p className="mt-3 text-xs text-muted">
            אין לראות בתוכן זה תחליף לייעוץ אישי.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} הקופה הלאומית · עמותת חסד יסובבנו</p>
          <p>נבנה בקפידה · ללא מעקב פרטי במצב דיסקרטי</p>
        </div>
      </div>
    </footer>
  );
}
