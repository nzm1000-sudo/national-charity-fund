/** Language-only rendering edits. Stored rules, quotations and decisions stay intact. */
export function publicCopy(text: string): string {
  return text
    .replace(/ — /g, ", ")
    .replace(/דיסקרטיות/g, "צנעה")
    .replace(/דיסקרטי/g, "בצנעה")
    .replace(/אנונימיות/g, "עילום שם")
    .replace(/אנונימי/g, "בעילום שם")
    .replace(/קטגוריה/g, "קופה")
    .replace(/פרויקטים/g, "מיזמים")
    .replace(/פרויקט/g, "מיזם")
    .replace(/מה שקרה/g, "מה שאירע")
    .replace(/אין לי מושג/g, "אינני יודע")
    .replace(/אימייל/g, "דואר אלקטרוני");
}
