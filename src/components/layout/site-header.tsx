"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  ["/hashavat-mamon", "השבת ממון"], ["/tzrachei-rabim", "צרכי רבים"],
  ["/maaser", "מעשר כספים"], ["/tzedakah", "צדקה"], ["/pidyon", "פדיון נפש"],
  ["/where-the-money-goes", "לאן מגיעה התרומה"], ["/faq", "שאלות ותשובות"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function dismissEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, [open]);

  return (
    <header className="site-header border-b border-border bg-parchment">
      <div className="container-page header-row">
        <Link href="/tzedakah" className="header-donate"><Heart size={14} aria-hidden="true" /><span>לתרומה</span></Link>
        <Link href="/" aria-label="הקופה הלאומית, לדף הבית" className="header-brand no-underline">
          <small className="header-organization">ארגון חסד יסובבנו</small>
          <strong>הקופה הלאומית</strong>
          <small className="header-tagline">להשיב, לתת ולתקן</small>
        </Link>
        <div className="header-controls">
          <button ref={toggleRef} type="button" aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"} title={open ? "סגירת תפריט" : "פתיחת תפריט"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)} className="privacy-control menu-toggle">{open ? <X size={18} /> : <Menu size={18} />}</button>
          <ThemeToggle compact />
        </div>
        <nav aria-label="ניווט ראשי" className="desktop-nav">
          <ul className="flex items-center gap-4">{NAV.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} className="site-nav-link">{label}</Link></li>)}</ul>
        </nav>
      </div>
      {open && <nav ref={menuRef} id="mobile-nav" aria-label="ניווט בנייד" className="mobile-nav">
        <ul className="grid">{NAV.map(([href, label]) => <li key={href}><Link href={href} onClick={() => setOpen(false)} className="mobile-route-link text-ink">{label}</Link></li>)}</ul>
        <div className="menu-appearance"><ThemeToggle /></div>
      </nav>}
    </header>
  );
}
