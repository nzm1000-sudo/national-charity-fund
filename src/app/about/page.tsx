import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { organization } from "@/lib/organization";
export const metadata: Metadata = {title:"אודות הארגון"};
export default function AboutPage() {
  return <Section><div className="container-page"><SectionHeading title="אודות הארגון" lead="הקופה הלאומית פועלת במסגרת ארגון ״חסד יסובבנו״ בנתיבות, בנשיאות הרב שלום יוסף ברבי." />
    <div className="text-column public-copy mt-12">
      <h2>להשיב, לתת ולתקן</h2><p>הקופה מאפשרת הסדרה של ממון שאינו שייך למחזיק בו, השבה לבעליו כאשר הדבר אפשרי והכוונה לצרכי רבים כאשר הבעלים אינם ידועים. המערכת אינה בית דין ואינה דורשת תיאור של המקרה.</p><p>לצד מסלול ההשבה פועלים מסלולי צדקה, מעשר כספים ופדיון נפש. לכל סוג תרומה נשמרים השיוך והכלל המתאים לו.</p>
      <h2>ארגון אחד, מגוון פרויקטים</h2><p>ארגון ״חסד יסובבנו״ פועל במספר פרויקטים ותחומי עשייה. הקופה הלאומית היא הכתובת למסלולי ההשבה והנתינה; ״כזוהר הרקיע״ הוא אחד הפרויקטים של הארגון, ואינו מייצג את כל פעילותו.</p><p>לצד סיוע למשפחות, חינוך לנוער וילדים בעלי מורכבויות ותמיכה במימון תרופות שאינן בסל הבריאות, הארגון מקדם עשייה קהילתית ותורנית.</p>
      <h2>פרויקט ״כזוהר הרקיע״</h2><p>הפרויקט בנתיבות מחבר בין עשייה רוחנית, קהילתית וחברתית. באתר הפרויקט מפורטים תחומי הפעילות המתוכננים והאפשרויות להצטרפות ולשותפות:</p><ul>{organization.projectActivities.map(activity => <li key={activity}>{activity}</li>)}</ul><p><a href={organization.projectUrl} target="_blank" rel="noopener noreferrer" className="text-link underline underline-offset-4">לאתר הפרויקט ולפרטי השותפות (נפתח בחלון חדש)</a></p>
      <h2>עקרונות הפעילות</h2><ul><li><strong>צנעה.</strong> נשאלות רק השאלות ההכרחיות לבחירת המסלול.</li><li><strong>עילום שם.</strong> אפשר להשלים את התהליכים המאפשרים זאת ללא מסירת שם.</li><li><strong>מקורות.</strong> ההסברים ההלכתיים מלווים במקורות ובסטטוס העיון הקיים במערכת.</li><li><strong>שקיפות.</strong> תרומות במסלול הפנימי משויכות לקופה ולכלל הקצאה מתועד. בתשלום חיצוני יש לתאם את השיוך עם הארגון.</li><li><strong>פרטיות.</strong> אין שמירה באתר של מספר כרטיס מלא או קוד אימות.</li></ul>
      <h2>פרטי הארגון</h2><p>{organization.name}, ע&quot;ר <bdi>{organization.registration}</bdi>, {organization.city}. בנשיאות {organization.president}.</p><div className="contact-phones">{organization.phones.map(phone => <a key={phone.href} href={phone.href}><bdi>{phone.display}</bdi></a>)}</div><p>{organization.taxNote}</p><p>תשלום באשראי ובביט מתבצע בנדרים פלוס. העברה בנקאית: בנק {organization.bank.name}, סניף <bdi>{organization.bank.branch}</bdi>, חשבון <bdi>{organization.bank.account}</bdi>. לקבלת קבלה יש לפנות לארגון.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4"><ButtonLink href="/#payment-and-contact">לכל אפשרויות התשלום ול־QR</ButtonLink><ButtonLink href="/hashavat-mamon" variant="secondary">להשבת ממון</ButtonLink></div>
    </div>
  </div></Section>;
}
