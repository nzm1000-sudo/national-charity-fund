"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { Emblem } from "./Emblem";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  ["/hashavat-mamon", "השבת ממון"], ["/tzrachei-rabim", "צרכי רבים"],
  ["/maaser", "מעשר כספים"], ["/tzedakah", "צדקה"], ["/pidyon", "פדיון נפש"],
  ["/where-the-money-goes", "לאן מגיעה התרומה"], ["/faq", "שאלות ותשובות"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header border-b border-border bg-parchment">
      <div className="container-page header-row">
        <Link href="/" aria-label="הקופה הלאומית, לדף הבית" className="shrink-0 no-underline">
          <span className="header-brand"><small className="header-organization">ארגון חסד יסובבנו</small><strong>הקופה הלאומית</strong><small>להשיב, לתת ולתקן</small><Emblem size={52} className="header-brand-seal" /></span>
        </Link>
        <nav aria-label="ניווט ראשי" className="desktop-nav">
          <ul className="flex items-center gap-4">{NAV.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} className="site-nav-link">{label}</Link></li>)}</ul>
        </nav>
        <div className="header-actions flex items-center gap-3">
          <span className="hidden sm:block"><ThemeToggle /></span>
          <Link href="/tzedakah" className="header-donate"><Heart size={16} aria-hidden="true" /><span>לתרומה</span></Link>
          <button type="button" aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"} title={open ? "סגירת תפריט" : "פתיחת תפריט"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)} className="privacy-control menu-toggle">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && <nav id="mobile-nav" aria-label="ניווט בנייד" className="container-page mobile-nav border-t border-border pb-6">
        <ul className="grid">{NAV.map(([href, label]) => <li key={href}><Link href={href} onClick={() => setOpen(false)} className="mobile-route-link flex min-h-12 items-center text-ink">{label}</Link></li>)}</ul>
        <div className="mt-4 sm:hidden"><ThemeToggle /></div>
      </nav>}
    </header>
  );
}
