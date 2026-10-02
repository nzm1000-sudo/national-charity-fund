import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { HALACHIC_DISCLAIMER_HE } from "@/lib/domain/halachic-rules-data";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <LogoMark size={34} className="text-[var(--color-text)]" />
            <p className="font-display text-lg font-black">הקופה הלאומית</p>
          </div>
          <p className="serif mt-3 text-[var(--text-meta)] text-[var(--color-text-muted)]">
            להשיב, לתקן ולתת
          </p>
          <p className="mt-4 text-[var(--text-meta)] leading-relaxed text-[var(--color-text-muted)]">
            מופעלת באמצעות עמותת חסד יסובבנו (ע&quot;ר 580509396), נתיבות — בנשיאות
            הרב שלום יוסף ברבי שליט&quot;א.
          </p>
        </div>

        <div>
          <h2 className="text-[var(--text-meta)] font-semibold text-[var(--color-text)]">מסלולים</h2>
          <ul className="mt-4 space-y-2 text-[var(--text-meta)]">
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/hashavat-mamon">השבת ממון</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/tzrachei-rabim">צרכי רבים</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/maaser">מעשר כספים</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/tzedakah">צדקה</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/pidyon">פדיון נפש</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[var(--text-meta)] font-semibold text-[var(--color-text)]">שקיפות</h2>
          <ul className="mt-4 space-y-2 text-[var(--text-meta)]">
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/where-the-money-goes">לאן הכסף מגיע?</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/faq">שאלות נפוצות</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/privacy">פרטיות</Link></li>
            <li><Link className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" href="/about">אודות העמותה</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[var(--text-meta)] font-semibold text-[var(--color-text)]">חשוב לדעת</h2>
          <p className="mt-4 text-[var(--text-meta)] leading-relaxed text-[var(--color-text-muted)]">
            {HALACHIC_DISCLAIMER_HE}
          </p>
          <p className="mt-3 text-[var(--text-caption)] text-[var(--color-text-muted)]">
            אין לראות בתוכן זה תחליף לייעוץ אישי.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="container-page flex flex-col gap-2 py-6 text-[var(--text-caption)] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p className="num">
            © {new Date().getFullYear()} הקופה הלאומית · עמותת חסד יסובבנו · ע&quot;ר 580509396
          </p>
          <p>
            פיתוח ותחזוקה:{" "}
            <span className="font-medium text-[var(--color-text)]">ניצוצא, ייעוץ רוחני אסטרטגי</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
