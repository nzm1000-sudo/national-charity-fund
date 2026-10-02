import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
export const metadata: Metadata = {title:"אודות העמותה"};
export default function AboutPage() {
  return <Section><div className="container-page"><SectionHeading title="אודות העמותה" lead="הקופה הלאומית פועלת במסגרת עמותת חסד יסובבנו בנתיבות, בנשיאות הרב שלום יוסף ברבי." />
    <div className="text-column public-copy mt-12"><h2>להשיב, לתקן ולתת</h2><p>הקופה מאפשרת הסדרה של ממון שאינו שייך למחזיק בו, השבה לבעליו כאשר הדבר אפשרי והכוונה לצרכי רבים כאשר הבעלים אינם ידועים. המערכת אינה בית דין ואינה דורשת תיאור של המקרה.</p><p>לצד מסלול ההשבה פועלים מסלולי צדקה, מעשר כספים ופדיון נפש. לכל סוג תרומה נשמרים השיוך והכלל המתאים לו.</p><h2>עקרונות הפעילות</h2><ul><li><strong>צנעה.</strong> נשאלות רק השאלות ההכרחיות לבחירת המסלול.</li><li><strong>עילום שם.</strong> אפשר להשלים את התהליכים המאפשרים זאת ללא מסירת שם.</li><li><strong>מקורות.</strong> ההסברים ההלכתיים מלווים במקורות ובסטטוס העיון הקיים במערכת.</li><li><strong>שקיפות.</strong> כל תרומה משויכת לקופה ולכלל הקצאה מתועד.</li><li><strong>פרטיות.</strong> אין שמירה של מספר כרטיס מלא או קוד אימות.</li></ul><h2>פרטי העמותה</h2><p>עמותת חסד יסובבנו, ע&quot;ר <bdi>580509396</bdi>, נתיבות. בנשיאות הרב שלום יוסף ברבי.</p><p>הכרה לצורכי מס ואופן הפקת קבלות: [לאישור]. פרטי קשר: [לאישור].</p><div className="mt-8 text-center"><ButtonLink href="/hashavat-mamon">להשבת ממון</ButtonLink></div></div>
  </div></Section>;
}
