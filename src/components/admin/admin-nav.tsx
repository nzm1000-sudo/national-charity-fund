"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Permission } from "@/lib/rbac";
import { cn } from "@/lib/cn";

const ITEMS: Array<{ href: string; label: string; permission: Permission }> = [
  { href: "/admin", label: "סקירה", permission: "finance.read" },
  { href: "/admin/finance", label: "כספים", permission: "finance.read" },
  { href: "/admin/causes", label: "מטרות וקמפיינים", permission: "causes.read" },
  { href: "/admin/halacha", label: "הלכה", permission: "halacha.read" },
  { href: "/admin/content", label: "תוכן", permission: "content.read" },
  { href: "/admin/qr", label: "QR", permission: "qr.read" },
  { href: "/admin/system", label: "מערכת", permission: "system.read" },
];

export function AdminNav({ permissions }: { permissions: Permission[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="ניווט ניהול">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ITEMS.filter((i) => permissions.includes(i.permission)).map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-ink-soft hover:bg-primary-tint hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
