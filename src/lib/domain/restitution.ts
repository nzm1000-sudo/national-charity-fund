/**
 * Restitution engine (pure).
 *
 * Classifies a person's monetary situation into a recommended route, without
 * ever asking for more than is needed. Never uses accusatory language.
 * See docs/HALACHA.md for the sources behind each rule code.
 */

export type OwnerKnown = "yes" | "no" | "unsure";
export type Reachability = "yes" | "no" | "unknown";
export type AmountKnowledge = "exact" | "range" | "unknown";
export type CauseType = "theft" | "damage" | "debt" | "error" | "doubt";

export interface RestitutionAnswers {
  ownerKnown: OwnerKnown;
  /** Only asked when ownerKnown === "yes". */
  reachable?: Reachability;
  /** True when the money came from many people / the public. */
  manyPeople?: boolean;
  amountKnowledge?: AmountKnowledge;
  causeType?: CauseType;
}

export type RestitutionRoute =
  | "return_direct"
  | "public_needs"
  | "voluntary"
  | "consult";

export interface RestitutionOutcome {
  route: RestitutionRoute;
  /** Suggested fund type for the resulting flow. */
  fundType: string;
  /** Whether the recommended route needs more info before proceeding. */
  needsMoreInfo: boolean;
  /** Question id to ask next when needsMoreInfo is true. */
  nextQuestion?: keyof RestitutionAnswers;
  ruleCode: string;
  headlineHe: string;
  explanationHe: string;
}

const RULE = {
  returnDirect: "HR-REST-001",
  unknownOwner: "HR-REST-002",
  untraceable: "HR-REST-003",
  fromMany: "HR-REST-004",
  doubt: "HR-REST-005",
} as const;

/**
 * Core classification. Ordering matters: a directly returnable case is always
 * preferred — the platform must never push a restitution case toward a
 * donation when the owner can still be reached.
 */
export function classifyRestitution(
  a: RestitutionAnswers,
): RestitutionOutcome {
  // Owner is known.
  if (a.ownerKnown === "yes") {
    if (a.reachable === "yes") {
      return {
        route: "return_direct",
        fundType: "restitution",
        needsMoreInfo: false,
        ruleCode: RULE.returnDirect,
        headlineHe: "אפשר וצריך להשיב ישירות לבעלים",
        explanationHe:
          "כאשר בעל הממון ידוע וניתן להגיע אליו, אין לתת את הכסף למטרה אחרת — צריך להשיב לו את הממון עצמו. אם תרצה, נעזור לך לנסח פנייה מכבדת ודיסקרטית.",
      };
    }
    if (a.reachable === "no") {
      return {
        route: "public_needs",
        fundType: "public_needs",
        needsMoreInfo: false,
        ruleCode: RULE.untraceable,
        headlineHe: "הבעלים ידוע אך אין אפשרות להשיב לו",
        explanationHe:
          "כאשר הבעלים ידוע אך אינו בנמצא, ואין יורשים או נציג שניתן להשיב להם, מרכזים את ההשבה בדברים שהרבים נהנים מהם — כדי שהבעלים או יורשיו ייהנו מהם בסופו של דבר.",
      };
    }
    // Reachability not yet known.
    return {
      route: "consult",
      fundType: "public_needs",
      needsMoreInfo: true,
      nextQuestion: "reachable",
      ruleCode: RULE.untraceable,
      headlineHe: "כדי לבחור נכון, נברר דבר אחד",
      explanationHe:
        "אם הבעלים עדיין ניתן לאיתור — יש להשיב לו ישירות. אם לא ניתן — מרכזים את ההשבה בדברים שהרבים נהנים מהם.",
    };
  }

  // Owner is not known.
  if (a.ownerKnown === "no") {
    if (a.manyPeople) {
      return {
        route: "public_needs",
        fundType: "public_needs",
        needsMoreInfo: false,
        ruleCode: RULE.fromMany,
        headlineHe: "ממון שנגבה מהרבים",
        explanationHe:
          "כאשר אין אפשרות לדעת ממי בדיוק נלקח, עושים בצדקה ובצרכי הרבים — באופן שהאדם שממנו נלקח עשוי ליהנות ממנו, וגם אם אינו יודע על כך, הדבר מועיל לו.",
      };
    }
    return {
      route: "public_needs",
      fundType: "public_needs",
      needsMoreInfo: false,
      ruleCode: RULE.unknownOwner,
      headlineHe: "אין בעלים ידוע — משבים באמצעות צרכי רבים",
      explanationHe:
        "כאשר אין דרך לדעת למי שייך הכסף, הדרך המקובלת היא להפנותו לדברים שהציבור נהנה מהם — מיזמים מתמשכים ומועילים, שהסיכוי שהבעלים ייהנה מהם הוא גדול יותר. הכל נעשה בדיסקרטיות מלאה.",
    };
  }

  // Unsure whether there is an obligation at all.
  return {
    route: "voluntary",
    fundType: "public_needs",
    needsMoreInfo: false,
    ruleCode: RULE.doubt,
    headlineHe: "ספק האם בכלל יש חובה",
    explanationHe:
      "כאשר יש ספק אם בכלל נוצר חיוב, אין חובה גמורה להשיב — אך רבים נוהגים לתת כמידת הזהירות. אפשר לבחור לתת, ואפשר גם להתייעץ. לא נשאל אותך על מה שקרה.",
  };
}

/** The question sequence for the flow, in order. */
export const RESTITUTION_QUESTIONS = [
  {
    id: "ownerKnown" as const,
    questionHe: "האם ידוע לך למי שייך הכסף?",
    options: [
      { value: "yes", labelHe: "כן, ידוע לי" },
      { value: "no", labelHe: "לא" },
      { value: "unsure", labelHe: "אולי / איני בטוח" },
    ],
  },
  {
    id: "reachable" as const,
    questionHe: "האם יש אפשרות סבירה להשיב לבעלים?",
    options: [
      { value: "yes", labelHe: "כן, אפשר להשיב לו" },
      { value: "no", labelHe: "לא, אין דרך להשיב לו" },
      { value: "unknown", labelHe: "איני יודע" },
    ],
  },
];
