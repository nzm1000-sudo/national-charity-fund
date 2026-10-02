import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "אודות",
  description: "הקופה הלאומית — עמותת חסד יסובבנו, נתיבות.",
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-10">
        <div className="container-page max-w-3xl">
          <SectionHeading
            rule
            eyebrow="העמותה המפעילה"
            title="הקופה הלאומית"
            lead="הקופה הלאומית מופעלת באמצעות עמותת חסד יסובבנו, בנשיאות הרב שלום יוסף ברבי, נתיבות. היא משמשת כגוף המפעיל והסליקה של המיזם."
          />
        </div>
      </Section>

      <Section className="border-y border-border bg-surface-2">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <Card>
            <CardBody>
              <h2 className="font-display text-lg">להשיב</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                לתת למי שיש בידו ממון שאינו שלו דרך מכובדת ודיסקרטית להשיבו — לבעליו
                אם ניתן, ולצרכי רבים אם לא.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 className="font-display text-lg">לתקן</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                לתקן בלי בושה ובלי שיפוט. המערכת אינה בית דין, אינה חוקרת ואינה
                דורשת וידוי.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 className="font-display text-lg">לתת</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                לתת צדקה, מעשר, פדיון נפש וצרכי רבים — בפשטות, באמינות ובשקיפות.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="container-page max-w-3xl space-y-6 text-[15px] leading-relaxed text-ink-soft">
          <h2 className="font-display text-2xl text-ink">העקרונות שלנו</h2>
          <ul className="space-y-3">
            <li>
              <strong className="text-ink">דיסקרטיות.</strong> אינך צריך לספר מה
              קרה. נשאל רק את ההכרחי.
            </li>
            <li>
              <strong className="text-ink">אנונימיות.</strong> אפשר להשלים תהליך
              בלי שם.
            </li>
            <li>
              <strong className="text-ink">אמינות הלכתית.</strong> כל כלל מבוסס
              מקורות, ומסומן בסטטוס. אין המצאה של מקורות.
            </li>
            <li>
              <strong className="text-ink">שקיפות.</strong> כל שקל משויך לסוג קופה
              ולמטרה, עם כלל מתועד.
            </li>
            <li>
              <strong className="text-ink">ביטחון ופרטיות.</strong> לא נשמרים פרטי
              כרטיס, ואין מעקב פרטי במצב דיסקרטי.
            </li>
          </ul>

          <div className="rounded-md border border-border bg-surface p-4 text-sm">
            <p>
              <strong>הערה בנושא קבלות ומיסים:</strong> אנחנו מפיקים קבלות לפי
              הצורך, אך איננו מצהירים על הטבת מס אלא אם סטטוס העמותה מאפשר זאת
              בפועל.
            </p>
          </div>

          <div className="pt-2">
            <ButtonLink href="/hashavat-mamon">להתחיל השבת ממון</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
