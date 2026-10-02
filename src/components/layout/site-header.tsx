"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Emblem } from "./Emblem";
import { DiscreetToggle } from "./discreet-toggle";

const NAV = [
  ["/hashavat-mamon", "השבת ממון"], ["/tzrachei-rabim", "צרכי רבים"],
  ["/maaser", "מעשר כספים"], ["/tzedakah", "צדקה"], ["/pidyon", "פדיון נפש"],
  ["/where-the-money-goes", "לאן מגיעה התרומה"], ["/faq", "שאלות ותשובות"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="border-b border-border bg-parchment">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="הקופה הלאומית, לדף הבית" className="flex shrink-0 items-center gap-3 no-underline">
          <Emblem size={32} />
          <span className="font-display text-xl">הקופה הלאומית</span>
        </Link>
        <nav aria-label="ניווט ראשי" className="hidden min-[1200px]:block">
          <ul className="flex items-center gap-4">{NAV.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} className="site-nav-link">{label}</Link></li>)}</ul>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block"><DiscreetToggle /></span>
          <button type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)} className="privacy-control min-[1200px]:hidden">תפריט</button>
        </div>
      </div>
      {open && <nav id="mobile-nav" aria-label="ניווט בנייד" className="container-page border-t border-border pb-6 min-[1200px]:hidden">
        <ul className="grid">{NAV.map(([href, label]) => <li key={href}><Link href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-base text-ink">{label}</Link></li>)}</ul>
        <div className="mt-4 sm:hidden"><DiscreetToggle /></div>
      </nav>}
    </header>
  );
}
