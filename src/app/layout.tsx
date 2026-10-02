import type { Metadata, Viewport } from "next";
import { env } from "@/lib/env";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme-init";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";
import "./seal.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: {
    default: "הקופה הלאומית — להשיב, לתקן ולתת",
    template: "%s · הקופה הלאומית",
  },
  description:
    "הכתובת להשבת ממון, צרכי רבים, מעשר כספים, צדקה ופדיון נפש. פשוט, מכובד, דיסקרטי ואמין.",
  applicationName: "הקופה הלאומית",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "הקופה הלאומית",
    title: "הקופה הלאומית — להשיב, לתקן ולתת",
    description: "הכתובת להשבת ממון, צדקה, מעשר ופדיון נפש — בדיסקרטיות.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#9a4a1f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={fontVariables} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-50 focus:rounded-[var(--radius-card)] focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-surface)]"
        >
          דלג לתוכן
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
