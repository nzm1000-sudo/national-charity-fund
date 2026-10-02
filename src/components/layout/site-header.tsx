"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { DiscreetToggle } from "@/components/layout/discreet-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoWordmark } from "@/components/brand/logo";

const NAV = [
  { href: "/hashavat-mamon", label: "השבת ממון" },
  { href: "/tzrachei-rabim", label: "צרכי רבים" },
  { href: "/maaser", label: "מעשר" },
  { href: "/tzedakah", label: "צדקה" },
  { href: "/pidyon", label: "פדיון נפש" },
  { href: "/where-the-money-goes", label: "לאן הכסף מגיע" },
  { href: "/faq", label: "שאלות" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="הקופה הלאומית — דף הבית" className="shrink-0">
          <LogoWordmark size={38} />
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-[var(--text-meta)] transition-colors duration-150",
                      active
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden xl:inline-flex">
            <ThemeToggle />
          </span>
          <span className="hidden md:inline-flex">
            <DiscreetToggle />
          </span>
          <ButtonLink href="/tzedakah" size="sm" className="hidden sm:inline-flex">
            לתרום
          </ButtonLink>
          <button
            type="button"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="ניווט ראשי (נייד)"
          className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <ul className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[var(--radius-sm)] px-3 py-3 text-[var(--text-base)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3 px-3 pb-2 pt-3">
              <ThemeToggle />
              <DiscreetToggle />
            </li>
            <li className="p-3">
              <ButtonLink href="/tzedakah" fullWidth onClick={() => setOpen(false)}>
                לתרום
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
