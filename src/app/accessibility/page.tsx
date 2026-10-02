import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
export const metadata: Metadata = {title:"הצהרת נגישות"};
export default function AccessibilityPage() {
  return <Section><div className="container-page"><SectionHeading title="הצהרת נגישות" lead="נגישות המידע והשירותים היא חלק מתכנון האתר." /><div className="text-column public-copy mt-12"><h2>התאמות באתר</h2><p>האתר נבנה בעברית ובכיווניות מימין לשמאל. ניתן לנווט בו באמצעות מקלדת, להשתמש בקישור דילוג לתוכן ולהגדיל את התצוגה. לשדות הטופס יש תוויות, ולמוקד המקלדת יש סימון גלוי.</p><p>יעד הנגישות הוא תקן ישראלי 5568 ודרישות הנגישות ברמה AA. השלמת בדיקת הנגישות והיקף ההתאמה: [לאישור].</p><h2>פנייה בנושא נגישות</h2><p>שם רכז הנגישות: [לאישור]. טלפון: [לאישור]. דואר אלקטרוני: [לאישור].</p><p>בפנייה מומלץ לציין את כתובת העמוד ואת תיאור הקושי. אין צורך למסור פרטים על נסיבות ההשבה או התרומה.</p></div></div></Section>;
}
