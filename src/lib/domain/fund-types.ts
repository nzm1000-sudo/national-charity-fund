/**
 * Fund types — the canonical categories every shekel is bound to.
 * Pure definitions (no DB imports) so they can be reused in UI, engines,
 * seeds and tests.
 */

export type FundTypeCode =
  | "restitution"
  | "public_needs"
  | "tzedakah"
  | "maaser"
  | "pidyon_nefesh"
  | "general"
  | "campaign";

export interface FundTypeDef {
  code: FundTypeCode;
  nameHe: string;
  /** One line shown on cards / QR landings. */
  taglineHe: string;
  descriptionHe: string;
  /** Internal halachic classification (not shown to users). */
  halachicClassification: string;
  route: string;
  receiptRequired: boolean;
  anonymousAllowed: boolean;
  minAmountAgorot: number;
  suggestedAmounts: number[];
  order: number;
}

/** Quick-amount presets in agorot; admin-overridable in DB. */
const CHAI = [1800, 3600, 5200, 7200, 10100, 18000, 36000, 50000];

export const FUND_TYPES: FundTypeDef[] = [
  {
    code: "restitution",
    nameHe: "השבת ממון",
    taglineHe: "יש כסף שאינך יודע למי להשיב?",
    descriptionHe:
      "מסלול מסודר למי שיש בידו ממון שאינו שלו ואינו יודע למי להחזירו. נבחר יחד את הדרך הנכונה להשבתו.",
    halachicClassification: "hashavat_mamon",
    route: "/hashavat-mamon",
    receiptRequired: false,
    anonymousAllowed: true,
    minAmountAgorot: 100,
    suggestedAmounts: CHAI,
    order: 1,
  },
  {
    code: "public_needs",
    nameHe: "צרכי רבים",
    taglineHe: "לדברים שהציבור כולו נהנה מהם",
    descriptionHe:
      "מיזמים מתמשכים וצרכים קהילתיים שהרבים נהנים מהם — המשך טבעי להשבת ממון שאין לו בעלים ידועים.",
    halachicClassification: "tzorchei_rabim",
    route: "/tzrachei-rabim",
    receiptRequired: true,
    anonymousAllowed: true,
    minAmountAgorot: 100,
    suggestedAmounts: CHAI,
    order: 2,
  },
  {
    code: "maaser",
    nameHe: "מעשר כספים",
    taglineHe: "להפריש מעשר מההכנסה",
    descriptionHe:
      "הפרשת מעשר מהכנסותיך. ניתן לחשב לפי הכנסות, לקבוע מטרה, ולשמור על רצף לאורך זמן.",
    halachicClassification: "maaser_kesafim",
    route: "/maaser",
    receiptRequired: true,
    anonymousAllowed: true,
    minAmountAgorot: 100,
    suggestedAmounts: CHAI,
    order: 3,
  },
  {
    code: "tzedakah",
    nameHe: "צדקה",
    taglineHe: "לתת לעניים ולמטרות חסד",
    descriptionHe:
      "בחירת מטרה, סכום, ותדירות. פשוט, מכובד, ובמידת האפשר אנונימי.",
    halachicClassification: "tzedakah",
    route: "/tzedakah",
    receiptRequired: true,
    anonymousAllowed: true,
    minAmountAgorot: 100,
    suggestedAmounts: CHAI,
    order: 4,
  },
  {
    code: "pidyon_nefesh",
    nameHe: "פדיון נפש",
    taglineHe: "מסלול נפרד עם נוסח וכוונה",
    descriptionHe:
      "פדיון נפש כמנהג ישראל — עם שם, שם האם, נוסח מתאים, ותרומה לצדקה לפי היכולת.",
    halachicClassification: "pidyon_nefesh",
    route: "/pidyon",
    receiptRequired: true,
    anonymousAllowed: false,
    minAmountAgorot: 1800,
    suggestedAmounts: [3600, 7200, 18000, 36000],
    order: 5,
  },
  {
    code: "general",
    nameHe: "תרומה כללית",
    taglineHe: "לתת בלי לבחור יותר מדי",
    descriptionHe: "למי שרוצה פשוט לתרום. אנחנו נדאג שהכסף יגיע למקום המתאים.",
    halachicClassification: "nedavah",
    route: "/tzedakah",
    receiptRequired: true,
    anonymousAllowed: true,
    minAmountAgorot: 100,
    suggestedAmounts: CHAI,
    order: 90,
  },
  {
    code: "campaign",
    nameHe: "קמפיין",
    taglineHe: "תרומה לקמפיין מסוים",
    descriptionHe: "תרומה ייעודית לקמפיין פעיל.",
    halachicClassification: "campaign",
    route: "/tzedakah",
    receiptRequired: true,
    anonymousAllowed: true,
    minAmountAgorot: 100,
    suggestedAmounts: CHAI,
    order: 95,
  },
];

export const FUND_TYPE_BY_CODE: Record<string, FundTypeDef> = Object.fromEntries(
  FUND_TYPES.map((f) => [f.code, f]),
);

export function getFundType(code: string): FundTypeDef | undefined {
  return FUND_TYPE_BY_CODE[code];
}

/** The four primary tracks shown on the home screen, in order. */
export const PRIMARY_TRACKS: FundTypeCode[] = [
  "restitution",
  "maaser",
  "tzedakah",
  "pidyon_nefesh",
];
