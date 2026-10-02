import type { HalachicRule, HalachicSourceRef } from "./halacha";

/**
 * Researched halachic sources and rules.
 *
 * Ground rules (see docs/HALACHA.md):
 *  - A `quote` field is ONLY used where the exact wording was verified.
 *  - Derivations and system behaviour live in `paraphrase` / `internalReasoning`.
 *  - Anything requiring a posek sign-off is marked `needs_review` or
 *    `provisional`, never presented to users as a definitive ruling.
 */

export interface HalachicSourceSeed {
  code: string;
  title: string;
  work?: string;
  author?: string;
  citation?: string;
  quote?: string;
  paraphrase?: string;
  url?: string;
  sourceType: "primary" | "secondary" | "verse" | "responsa";
  tradition: "general" | "sephardi" | "ashkenazi";
}

export const HALACHIC_SOURCES: HalachicSourceSeed[] = [
  {
    code: "SRC-TORAH-VAYIKRA-5-23",
    title: "מקור מצוות השבת הגזלה",
    work: "תורה",
    citation: "ויקרא ה, כ\"ג",
    quote: "וְהֵשִׁיב אֶת הַגְּזֵלָה אֲשֶׁר גָּזָל",
    sourceType: "verse",
    tradition: "general",
  },
  {
    code: "SRC-BEITZAH-29A",
    title: "גזל ואינו יודע למי גזל",
    work: "תלמוד בבלי",
    citation: "ביצה כ\"ט ע\"א",
    quote:
      "גזל ואינו יודע למי גזל — יעשה בהם צרכי רבים. מאי נינהו? אמר רב חסדא: בורות שיחין ומערות",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-RASHI-BK-94B",
    title: "טעם עשיית צרכי רבים",
    work: "רש\"י",
    citation: "בבא קמא צ\"ד ע\"ב",
    paraphrase:
      "בורות שתייה, שהדבר צריך לכל, ויהנו מהן הנגזלים — ולכן עדיף מיזם שהרבים נהנים ממנו בפועל.",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-RAMBAM-GEZELA-1-1",
    title: "חיוב השבת הגזלה",
    work: "משנה תורה",
    author: "רמב\"ם",
    citation: "הלכות גזילה ואבדה א, א'",
    quote:
      "כל הגוזל חייב להחזיר הגזילה עצמה שנאמר והשיב את הגזלה אשר גזל",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-RAMBAM-TESHUVA-4-3",
    title: "המקשה לשוב על גזל שאינו יודע למי",
    work: "משנה תורה",
    author: "רמב\"ם",
    citation: "הלכות תשובה ד, ג'",
    paraphrase:
      "הרמב\"ם מונה את מי שגזל ואינו יודע למי להשיב מבין חמישה שאין בידם תשובה גמורה.",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-SA-CM-366",
    title: "פסק ההלכה בהשבת גזל שאין בעליו ידועים",
    work: "שולחן ערוך",
    author: "מרן הרב יוסף קארו",
    citation: "חושן משפט סי' שס\"ו, ב'",
    paraphrase:
      "השו\"ע פסק את הדין לעשות בצרכי רבים, והביא את הבורות כדוגמא בעלמא לדברים שהציבור נהנה מהם.",
    sourceType: "primary",
    tradition: "sephardi",
  },
  {
    code: "SRC-ARUCH-MISHPAT-CM-18",
    title: "מקום עשיית צרכי הרבים",
    work: "שו\"ת אורח משפט",
    author: "הראי\"ה קוק",
    citation: "חו\"מ סי' י\"ח",
    paraphrase:
      "צרכי הרבים יעשו במקום שמסתבר שהנגזל או יורשיו עשויים ליהנות מהם.",
    sourceType: "responsa",
    tradition: "general",
  },
  {
    code: "SRC-IGROT-MOSHE-CM-88",
    title: "צרכי רבים ולא צדקה, ובסתר",
    work: "שו\"ת אגרות משה",
    author: "הרב משה פיינשטיין",
    citation: "חו\"מ ח\"א סי' פ\"ח",
    paraphrase:
      "כשאין הגזלן מכיר את בעל הגזלה — יתן דווקא לצרכי רבים ולא לצדקה, ויהפוך הדבר שיהיה בסתר.",
    sourceType: "responsa",
    tradition: "ashkenazi",
  },
  {
    code: "SRC-CHELKAT-YAAKOV-CM-16",
    title: "צדקה כשידוע שאין הבעלים לפנינו",
    work: "שו\"ת חלקת יעקב",
    author: "הרב יעקב ישראל קניבסקי",
    citation: "חו\"מ סי' ט\"ז",
    paraphrase:
      "כשברור שהבעלים או יורשיהם אינם לפנינו, יש שהעדיפו לתת לצדקה, שאף במצווה הנעשית שלא בידיעתם מגיעה להם תועלת.",
    sourceType: "responsa",
    tradition: "ashkenazi",
  },
  {
    code: "SRC-MINCHAT-SHLOMO-135",
    title: "תוקף התקנה — מידת חסידות",
    work: "שו\"ת מנחת שלמה",
    author: "הרב שלמה זלמן אוירבך",
    citation: "תנינא סי' קל\"ה",
    paraphrase:
      "סובר שאין כאן חובה גמורה, אלא מידת חסידות, שרק מעט מן התשלום מגיע לנגזל.",
    sourceType: "responsa",
    tradition: "ashkenazi",
  },
  {
    code: "SRC-HALACHAYOMIT-MAASER",
    title: "מעשר כספים — מנהג הספרדים",
    work: "הלכה יומית",
    citation: "מעשר כספים",
    paraphrase:
      "לדעת הרמ\"א מעשר כספים חובה ממש; ולמנהג הספרדים אין זה חיוב ממש, אך מי שאינו מפריש נחשב \"עין רעה\". דעת מרן הרב עובדיה יוסף שיש בו חובת מנהג, ורק בשעת הדחק מקילים.",
    url: "https://halachayomit.co.il/he/default.aspx?HalachaID=6312",
    sourceType: "secondary",
    tradition: "sephardi",
  },
  {
    code: "SRC-RAMBAM-MATNOT",
    title: "הלכות צדקה",
    work: "משנה תורה",
    author: "רמב\"ם",
    citation: "הלכות מתנות עניים",
    paraphrase:
      "פרטי מצוות הצדקה, הקופה והתמחוי, ומדרגות הנתינה וסדרי העדיפות.",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-TORAH-DEVARIM-15",
    title: "מקור מצוות הצדקה",
    work: "תורה",
    citation: "דברים ט\"ו",
    paraphrase: "פתוח תפתח את ידך לאחיך, לענייך ולאביונך בארצך.",
    sourceType: "verse",
    tradition: "general",
  },
  {
    code: "SRC-MISHLEI-10-2",
    title: "צדקה תציל ממות",
    work: "משלי",
    citation: "י, ב'",
    quote: "וּצְדָקָה תַּצִּיל מִמָּוֶת",
    sourceType: "verse",
    tradition: "general",
  },
  {
    code: "SRC-PEI-ETZ-CHAIM",
    title: "מעלת הפדיון",
    work: "פרי עץ חיים",
    citation: "עניין פדיון נפש",
    quote:
      "ופדיון נפש זה הוא תועלת ותרופה לכל צרה שלא תבוא ובפרט לחולים",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-BNEI-YISSASCHAR",
    title: "סכום 160 מטבעות (גימטריא כס\"ף)",
    work: "בני יששכר",
    author: "רבי צבי אלימלך שפירא מדינוב",
    paraphrase:
      "מנהג ליתן 160 מטבעות לצדקה עבור פדיון הנפש, כמניין \"כסף\" — ואין זה חיוב, אלא מנהג.",
    sourceType: "primary",
    tradition: "general",
  },
  {
    code: "SRC-ZOHAR",
    title: "פדיון הנפש כנגד הוצאת ממון",
    work: "זוהר",
    citation: "מבואר בפוסקים",
    paraphrase:
      "על החולה נגזר לבזבז ממון לרפואות; על ידי נתינת כסף לצדקה לעניים הוגנים מתבטלת הגזרה.",
    sourceType: "primary",
    tradition: "general",
  },
];

function ref(
  code: string,
  role: HalachicSourceRef["role"] = "supporting",
): HalachicSourceRef {
  return { code, role };
}

export const HALACHIC_RULES: HalachicRule[] = [
  {
    code: "HR-REST-001",
    topic: "השבת ממון",
    subtopic: "בעלים ידוע וניתן להגיע אליו",
    condition: { fundType: "restitution", answers: { ownerKnown: "yes", reachable: "yes" } },
    decision: { route: "return_direct", fundType: "restitution" },
    publicExplanation:
      "כאשר בעל הממון ידוע וניתן להגיע אליו — מצווה להשיב לו את הממון עצמו, ואין להפנותו למטרה אחרת.",
    internalReasoning:
      "יישום ישיר של חיוב ההשבה (ויקרא ה, כ\"ג; רמב\"ם גזילה ואבדה א, א'). אין כאן מסקנת מערכת.",
    confidence: "high",
    status: "strong_basis",
    priority: 10,
    sources: [
      ref("SRC-TORAH-VAYIKRA-5-23", "primary"),
      ref("SRC-RAMBAM-GEZELA-1-1", "primary"),
    ],
  },
  {
    code: "HR-REST-002",
    topic: "השבת ממון",
    subtopic: "אין בעלים ידועים",
    condition: { fundType: "restitution", answers: { ownerKnown: "no", manyPeople: "false" } },
    decision: { route: "public_needs", fundType: "public_needs" },
    publicExplanation:
      "כאשר אין דרך לדעת למי שייך הכסף, הדרך המקובלת היא להפנותו לדברים שהציבור נהנה מהם — מיזמים מתמשכים, שהסיכוי שהבעלים ייהנה מהם גדול יותר.",
    internalReasoning:
      "ביצה כ\"ט ע\"א; שו\"ע חו\"מ שס\"ו, ב'. מנוע המערכת ממליץ על מיזמים מתמשכים כהשלכה מהטעם ברש\"י ובפוסקים (ראו HR-REST-008).",
    confidence: "high",
    status: "strong_basis",
    priority: 10,
    sources: [
      ref("SRC-BEITZAH-29A", "primary"),
      ref("SRC-SA-CM-366", "primary"),
      ref("SRC-RASHI-BK-94B", "supporting"),
    ],
  },
  {
    code: "HR-REST-003",
    topic: "השבת ממון",
    subtopic: "בעלים ידוע שאינו בנמצא",
    condition: { fundType: "restitution", answers: { ownerKnown: "yes", reachable: "no" } },
    decision: { route: "public_needs", fundType: "public_needs" },
    publicExplanation:
      "כאשר הבעלים ידוע אך אין אפשרות להשיב לו ואין יורשים או נציג — מרכזים את ההשבה בדברים שהרבים נהנים מהם.",
    internalReasoning:
      "נחלקו האחרונים אם להעדיף צרכי רבים (אגרות משה חו\"מ פ\"ח; חלקת יעקב חו\"מ ט\"ז) או צדקה כשהבעלים ודאי אינם לפנינו. מצב `disputed` — ברירת המחדל במערכת היא צרכי רבים, וניתן להחליף ב-Admin.",
    confidence: "medium",
    status: "disputed",
    priority: 8,
    sources: [
      ref("SRC-IGROT-MOSHE-CM-88", "primary"),
      ref("SRC-CHELKAT-YAAKOV-CM-16", "dissent"),
    ],
  },
  {
    code: "HR-REST-004",
    topic: "השבת ממון",
    subtopic: "גזל הרבים",
    condition: { fundType: "restitution", answers: { ownerKnown: "no", manyPeople: "true" } },
    decision: { route: "public_needs", fundType: "public_needs" },
    publicExplanation:
      "כשהממון נגבה מאנשים רבים ואין לדעת ממי בדיוק — עושים בצרכי הרבים, באופן שהאדם שממנו נלקח עשוי ליהנות ממנו.",
    internalReasoning:
      "ביצה כ\"ט ע\"א; רש\"י ב\"ק צ\"ד ע\"ב (דהוי דבר הצריך לכל ויהנו מהן הנגזלים).",
    confidence: "high",
    status: "strong_basis",
    priority: 10,
    sources: [
      ref("SRC-BEITZAH-29A", "primary"),
      ref("SRC-RASHI-BK-94B", "supporting"),
    ],
  },
  {
    code: "HR-REST-005",
    topic: "השבת ממון",
    subtopic: "ספק אם נוצר חיוב",
    condition: { fundType: "restitution", answers: { ownerKnown: "unsure" } },
    decision: { route: "voluntary", fundType: "public_needs" },
    publicExplanation:
      "כאשר יש ספק אם בכלל נוצר חיוב — אין חובה גמורה, אך רבים נוהגים לתת כמידת הזהירות. ניתן גם להתייעץ.",
    internalReasoning:
      "אין כאן דין מפורש; זוהי הנהגת מערכת המבוססת על עקרון הזהירות בדיני ממונות. מסומן provisional עד לעיון פוסק.",
    confidence: "low",
    status: "provisional",
    priority: 5,
    sources: [ref("SRC-SA-CM-366", "supporting")],
  },
  {
    code: "HR-REST-006",
    topic: "השבת ממון",
    subtopic: "סכום שאינו ידוע",
    condition: { fundType: "restitution", answers: { amountKnowledge: "unknown" } },
    decision: { route: "public_needs", fundType: "public_needs", note: "estimate_with_margin" },
    publicExplanation:
      "אם אינך זוכר את הסכום המדויק, אפשר להעריך סכום סביר ולהוסיף מעט מרווח ביטחון כדי לצאת מן הספק.",
    internalReasoning:
      "אין בדיקה זו מקור ישיר לסכום; זהו כלי הערכה של המערכת המבוסס על עקרון היציאה מן הספק. נדרש עיון פוסק לפני הצגה כפסיקה.",
    confidence: "low",
    status: "needs_review",
    priority: 4,
    sources: [ref("SRC-SA-CM-366", "supporting")],
  },
  {
    code: "HR-REST-007",
    topic: "השבת ממון",
    subtopic: "עשיית ההשבה בסתר",
    condition: { fundType: "restitution" },
    decision: { route: "public_needs", fundType: "public_needs" },
    publicExplanation:
      "ההשבה נעשית בדיסקרטיות — בלי פרסום ובלי כבוד על הנתינה, שכך היא שלמה יותר.",
    internalReasoning:
      "אגרות משה חו\"מ פ\"ח: להקפיד שתהא הנתינה בסתר. לכן ברירת המחדל במערכת היא אנונימיות.",
    confidence: "medium",
    status: "strong_basis",
    priority: 3,
    sources: [ref("SRC-IGROT-MOSHE-CM-88", "primary")],
  },
  {
    code: "HR-REST-008",
    topic: "השבת ממון",
    subtopic: "גדרי צרכי הרבים",
    condition: { fundType: "public_needs" },
    decision: { route: "public_needs", fundType: "public_needs" },
    publicExplanation:
      "צרכי הרבים מתאימים לדברים מתמשכים שהציבור נהנה מהם — כך הסיכוי שהנגזל או יורשיו ייהנו מהם גדול יותר.",
    internalReasoning:
      "אורח משפט חו\"מ י\"ח (מקום שהנגזל עלול ליהנות); ישמח לבב (דבר מתקיים). יישום מערכתי: היעדים המוצעים למסלול זה מסוננים לפי עקרונות אלו.",
    confidence: "medium",
    status: "strong_basis",
    priority: 6,
    sources: [
      ref("SRC-ARUCH-MISHPAT-CM-18", "primary"),
      ref("SRC-RASHI-BK-94B", "supporting"),
    ],
  },
  {
    code: "HR-MAASER-001",
    topic: "מעשר כספים",
    subtopic: "תוקף החיוב ושיעור המעשר",
    condition: { fundType: "maaser" },
    decision: { route: "maaser", fundType: "maaser", note: "rate_10_percent" },
    publicExplanation:
      "נהוג להפריש עשירית מן ההכנסה (מעשר כספים). למנהג הספרדים זהו מנהג שיש לו תוקף, ולרוב הדעות ראוי לקיימו.",
    internalReasoning:
      "לדעת הרמ\"א חובה ממש; למנהג הספרדים מנהג מחייב ומי שאינו מפריש נחשב \"עין רעה\" (הלכה יומית; דעת מרן הרב עובדיה יוסף). נחלקו הראשונים אם זה חלק ממעשרות או מצדקה. הסכום ניתן לשינוי ב-Admin.",
    confidence: "medium",
    status: "disputed",
    priority: 8,
    sources: [ref("SRC-HALACHAYOMIT-MAASER", "primary")],
  },
  {
    code: "HR-TZED-001",
    topic: "צדקה",
    subtopic: "חיוב הנתינה",
    condition: { fundType: "tzedakah" },
    decision: { route: "tzedakah", fundType: "tzedakah" },
    publicExplanation:
      "צדקה היא מצווה. נותנים לפי היכולת, ולמטרות מתאימות; אפשר לעשות זאת בדיסקרטיות.",
    internalReasoning:
      "רמב\"ם הלכות מתנות עניים; דברים ט\"ו. סדרי עדיפות וגדרי הקופה מוגדרים כ-Config במנוע ההקצאה.",
    confidence: "high",
    status: "strong_basis",
    priority: 8,
    sources: [
      ref("SRC-RAMBAM-MATNOT", "primary"),
      ref("SRC-TORAH-DEVARIM-15", "primary"),
    ],
  },
  {
    code: "HR-PID-001",
    topic: "פדיון נפש",
    subtopic: "מהות המנהג ואופן ביצועו",
    condition: { fundType: "pidyon_nefesh" },
    decision: { route: "pidyon_nefesh", fundType: "pidyon_nefesh", note: "no_fixed_sum" },
    publicExplanation:
      "פדיון נפש הוא מנהג ישראל: נותנים צדקה, ואפשר לצרף שם ושם האם. אין סכום חובה — כל אחד לפי יכולתו, ויש הנוהגים 160 מטבעות כמניין \"כסף\".",
    internalReasoning:
      "מנהג ולא חובה (פרי עץ חיים; זוהר כמבואר בפוסקים; בני יששכר — 160 מטבעות). אין לקבוע סכום חובה. הנוסח והסכום המוצעים מוגדרים ב-Admin.",
    confidence: "medium",
    status: "strong_basis",
    priority: 8,
    sources: [
      ref("SRC-PEI-ETZ-CHAIM", "primary"),
      ref("SRC-BNEI-YISSASCHAR", "supporting"),
      ref("SRC-ZOHAR", "supporting"),
      ref("SRC-MISHLEI-10-2", "supporting"),
    ],
  },
  {
    code: "HR-PUB-001",
    topic: "צרכי רבים",
    subtopic: "הגדרה ושימושים מותרים",
    condition: { fundType: "public_needs" },
    decision: { route: "public_needs", fundType: "public_needs", note: "durable_public_benefit" },
    publicExplanation:
      "צרכי רבים הם דברים שהציבור כולו נהנה מהם באופן מתמשך — ולכן הם מתאימים במיוחד גם להשבת ממון שאין לו בעלים ידועים.",
    internalReasoning:
      "אינו זהה ל\"צדקה\" לעני. ההגדרה נשענת על ביצה כ\"ט ע\"א, שו\"ע חו\"מ שס\"ו ב', והטעם ברש\"י. רשימת היעדים המאושרים/האסורים מוגדרת ב-FundTypeDestination וב-FundRule.",
    confidence: "medium",
    status: "strong_basis",
    priority: 6,
    sources: [
      ref("SRC-BEITZAH-29A", "primary"),
      ref("SRC-SA-CM-366", "primary"),
      ref("SRC-ARUCH-MISHPAT-CM-18", "supporting"),
    ],
  },
];

/** Public, plain-Hebrew disclaimer shown next to halachic content. */
export const HALACHIC_DISCLAIMER_HE =
  "ההסברים מבוססים על מקורות שפורסמו ונבדקו. במקרה אישי מורכב — כדאי להתייעץ עם רב. לא נשמור תיאור של מה שקרה.";
