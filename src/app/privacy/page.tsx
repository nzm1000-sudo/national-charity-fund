import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "פרטיות",
  description: "כיצד אנחנו שומרים על הפרטיות שלך — מינימום מידע, מצב דיסקרטי.",
};

export default function PrivacyPage() {
  return (
    <Section className="pt-10">
      <div className="container-page max-w-3xl space-y-6 text-[15px] leading-relaxed text-ink-soft">
        <SectionHeading
          rule
          eyebrow="פרטיות בעיצוב"
          title="הפרטיות שלך"
          lead="אנחנו אוספים את המינימום ההכרחי כדי לבצע את הפעולה — לא יותר."
        />

        <h2 className="font-display text-2xl text-ink">עקרון הצמצום</h2>
        <p>
          במסלולים רגישים, ובעיקר בהשבת ממון, איננו מבקשים תיאור של מה שקרה,
          שם של בעל ממון, או מידע אישי שאינו נדרש. אפשר להשלים תהליך בלי להירשם.
        </p>

        <h2 className="font-display text-2xl text-ink">מצב דיסקרטי</h2>
        <p>
          כאשר מצב דיסקרטי מופעל, לא נאספים נתוני analytics, אין cookies שיווקיים,
          אין remarketing ואין שמירה של תוכן רגיש בדפדפן מעבר לנדרש.
        </p>

        <h2 className="font-display text-2xl text-ink">סליקה וקבלות</h2>
        <p>
          התשלום מתבצע בדף מאובטח של ספק הסליקה. איננו שומרים מספר כרטיס מלא או
          CVV — רק אסמכתא של הספק. במקרים שבהם נדרשת קבלה, נבקש רק את הפרטים
          שהדין והנהלת החשבונות מחייבים.
        </p>

        <h2 className="font-display text-2xl text-ink">Analytics</h2>
        <p>
          אנחנו מודדים את הצלחת המסלולים בלי להפוך אותך למוצר. נשמר מזהה סשן
          מגובב (hash) שאינו מזהה אותך ואינו נשמר לאורך זמן. במצב דיסקרטי —
          אין מדידה כלל.
        </p>

        <h2 className="font-display text-2xl text-ink">אנונימיות מול המיזם</h2>
        <p>
          אנונימיות כלפי המיזם נשמרת במלואה. המידע שספק סליקה או הדין מחייבים
          לעבד הוא נפרד, מוגבל, ומשמש רק לצורך ביצוע הפעולה והקבלה.
        </p>

        <h2 className="font-display text-2xl text-ink">הזכויות שלך</h2>
        <p>
          ניתן לפנות אלינו כדי לעיין במידע שנשמר, לתקן אותו, או לבקש מחיקה —
          בכפוף לחובות שמירה שבדין (למשל תיעוד חשבונאי).
        </p>
      </div>
    </Section>
  );
}
