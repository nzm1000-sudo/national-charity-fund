import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { ROLES } from "../src/lib/rbac";
import { FUND_TYPES } from "../src/lib/domain/fund-types";
import {
  HALACHIC_RULES,
  HALACHIC_SOURCES,
} from "../src/lib/domain/halachic-rules-data";
import { env } from "../src/lib/env";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding הקופה הלאומית…");

  // ---- Roles ----
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { nameHe: role.nameHe, permissions: JSON.stringify(role.permissions) },
      create: {
        code: role.code,
        nameHe: role.nameHe,
        permissions: JSON.stringify(role.permissions),
      },
    });
  }

  // ---- Admin bootstrap ----
  const ownerRole = await prisma.role.findUnique({ where: { code: "owner" } });
  await prisma.adminUser.upsert({
    where: { email: env.ADMIN_BOOTSTRAP_EMAIL },
    update: { roleId: ownerRole?.id },
    create: {
      email: env.ADMIN_BOOTSTRAP_EMAIL,
      name: "מנהל ראשי",
      passwordHash: hashPassword(env.ADMIN_BOOTSTRAP_PASSWORD),
      roleId: ownerRole?.id,
    },
  });

  // ---- Fund types ----
  for (const f of FUND_TYPES) {
    await prisma.fundType.upsert({
      where: { code: f.code },
      update: {
        nameHe: f.nameHe,
        description: f.descriptionHe,
        halachicClassification: f.halachicClassification,
        sortOrder: f.order,
        suggestedAmounts: JSON.stringify(f.suggestedAmounts),
        minAmount: f.minAmountAgorot,
        receiptRequired: f.receiptRequired,
        anonymousAllowed: f.anonymousAllowed,
      },
      create: {
        code: f.code,
        nameHe: f.nameHe,
        description: f.descriptionHe,
        halachicClassification: f.halachicClassification,
        sortOrder: f.order,
        suggestedAmounts: JSON.stringify(f.suggestedAmounts),
        minAmount: f.minAmountAgorot,
        receiptRequired: f.receiptRequired,
        anonymousAllowed: f.anonymousAllowed,
      },
    });
  }

  // ---- Causes ----
  const causes = [
    { slug: "medicines", nameHe: "תרופות לחולים", category: "health", summary: "סיוע בתרופות וטיפולים לחולים נזקקים.", sortOrder: 1 },
    { slug: "food", nameHe: "מזון למשפחות", category: "food", summary: "סלי מזון למשפחות במצוקה.", sortOrder: 2 },
    { slug: "widows-orphans", nameHe: "אלמנות ויתומים", category: "family", summary: "תמיכה באלמנות ויתומים.", sortOrder: 3 },
    { slug: "beit-knesset", nameHe: "בית הכנסת והמרכז הקהילתי — נתיבות", category: "community", summary: "החזקת בית הכנסת והמרכז הרוחני־קהילתי בנתיבות.", sortOrder: 4 },
    { slug: "kollel", nameHe: "החזקת אברכים ולומדי תורה", category: "torah", summary: "תמיכה בלומדי תורה ובאברכים.", sortOrder: 5 },
    { slug: "needy", nameHe: "נזקקים ונזקקות", category: "welfare", summary: "סיוע לנזקקים.", sortOrder: 6 },
    { slug: "elderly", nameHe: "קשישים", category: "welfare", summary: "סיוע לקשישים בודדים ונזקקים.", sortOrder: 7 },
    { slug: "children-youth", nameHe: "ילדים ונוער", category: "youth", summary: "תוכניות וסיוע לילדים ולנוער.", sortOrder: 8 },
    { slug: "guidance", nameHe: "ייעוץ והכוונה לציבור", category: "guidance", summary: "מענה, ייעוץ והכוונה לציבור.", sortOrder: 9 },
    { slug: "public-needs", nameHe: "צרכי רבים", category: "general", summary: "מיזמים מתמשכים שהציבור נהנה מהם.", sortOrder: 10 },
    { slug: "where-needed-most", nameHe: "היכן שהכי צריכים אותי", category: "general", summary: "אנחנו נפנה את התרומה למקום הדחוף ביותר.", sortOrder: 11 },
  ];

  for (const c of causes) {
    await prisma.cause.upsert({
      where: { slug: c.slug },
      update: { nameHe: c.nameHe, summary: c.summary, category: c.category, sortOrder: c.sortOrder },
      create: c,
    });
  }

  const causeBySlug = Object.fromEntries(
    (await prisma.cause.findMany()).map((c) => [c.slug, c.id]),
  );

  // ---- Fund type → allowed destinations ----
  // tzedakah: all welfare causes. public_needs: only durable public benefit.
  const destinations: Array<{ fundTypeCode: string; slug: string; priority: number }> = [
    // tzedakah — broad
    ...["medicines", "food", "widows-orphans", "needy", "elderly", "children-youth", "kollel", "beit-knesset"].map(
      (slug, i) => ({ fundTypeCode: "tzedakah", slug, priority: 100 - i }),
    ),
    { fundTypeCode: "tzedakah", slug: "where-needed-most", priority: 10 },
    // public_needs — durable, public benefit only
    { fundTypeCode: "public_needs", slug: "public-needs", priority: 100 },
    { fundTypeCode: "public_needs", slug: "beit-knesset", priority: 90 },
    { fundTypeCode: "public_needs", slug: "guidance", priority: 80 },
    { fundTypeCode: "public_needs", slug: "children-youth", priority: 70 },
    { fundTypeCode: "public_needs", slug: "kollel", priority: 60 },
    // maaser — same range as tzedakah
    ...["medicines", "food", "widows-orphans", "needy", "elderly", "children-youth", "kollel"].map(
      (slug, i) => ({ fundTypeCode: "maaser", slug, priority: 100 - i }),
    ),
    { fundTypeCode: "maaser", slug: "where-needed-most", priority: 10 },
    // pidyon_nefesh — charity to the needy
    { fundTypeCode: "pidyon_nefesh", slug: "needy", priority: 100 },
    { fundTypeCode: "pidyon_nefesh", slug: "where-needed-most", priority: 90 },
    // general / campaign — anything
    ...causes.map((c, i) => ({
      fundTypeCode: "general",
      slug: c.slug,
      priority: 100 - i,
    })),
  ];

  for (const d of destinations) {
    const causeId = causeBySlug[d.slug];
    if (!causeId) continue;
    await prisma.fundTypeDestination.upsert({
      where: {
        fundTypeCode_causeId: { fundTypeCode: d.fundTypeCode, causeId },
      },
      update: { priority: d.priority, allowed: true },
      create: {
        fundTypeCode: d.fundTypeCode,
        causeId,
        priority: d.priority,
        allowed: true,
      },
    });
  }

  // ---- Halachic sources ----
  for (const s of HALACHIC_SOURCES) {
    await prisma.halachicSource.upsert({
      where: { code: s.code },
      update: {
        title: s.title,
        work: s.work,
        author: s.author,
        citation: s.citation,
        quote: s.quote,
        paraphrase: s.paraphrase,
        url: s.url,
        sourceType: s.sourceType,
        tradition: s.tradition,
      },
      create: {
        code: s.code,
        title: s.title,
        work: s.work,
        author: s.author,
        citation: s.citation,
        quote: s.quote,
        paraphrase: s.paraphrase,
        url: s.url,
        sourceType: s.sourceType,
        tradition: s.tradition,
      },
    });
  }

  const sourceByCode = Object.fromEntries(
    (await prisma.halachicSource.findMany()).map((s) => [s.code, s.id]),
  );

  // ---- Halachic rules (+ versions + source links) ----
  for (const r of HALACHIC_RULES) {
    const record = await prisma.halachicRule.upsert({
      where: { code: r.code },
      update: {
        topic: r.topic,
        subtopic: r.subtopic,
        condition: JSON.stringify(r.condition),
        decision: JSON.stringify(r.decision),
        publicExplanation: r.publicExplanation,
        internalReasoning: r.internalReasoning,
        confidence: r.confidence,
        status: r.status,
      },
      create: {
        code: r.code,
        topic: r.topic,
        subtopic: r.subtopic,
        condition: JSON.stringify(r.condition),
        decision: JSON.stringify(r.decision),
        publicExplanation: r.publicExplanation,
        internalReasoning: r.internalReasoning,
        confidence: r.confidence,
        status: r.status,
        currentVersion: 1,
      },
    });

    for (const src of r.sources) {
      const sourceId = sourceByCode[src.code];
      if (!sourceId) continue;
      await prisma.halachicRuleSource.upsert({
        where: { ruleId_sourceId: { ruleId: record.id, sourceId } },
        update: { role: src.role },
        create: { ruleId: record.id, sourceId, role: src.role },
      });
    }

    await prisma.halachicRuleVersion.upsert({
      where: { ruleId_version: { ruleId: record.id, version: 1 } },
      update: {},
      create: {
        ruleId: record.id,
        version: 1,
        decision: JSON.stringify(r.decision),
        publicExplanation: r.publicExplanation,
        internalReasoning: r.internalReasoning,
        status: r.status,
        confidence: r.confidence,
        reason: "גרסה ראשונית שנבעה ממחקר מקורות",
        author: "system:discovery",
      },
    });
  }

  // ---- Fund rules (allocation defaults) ----
  const fundRules = [
    {
      code: "FR-PUBLIC-DURABLE-ONLY",
      fundTypeCode: "public_needs",
      decision: "public_benefit_durable",
      priority: 50,
      halachicRuleCode: "HR-PUB-001",
      note: "צרכי רבים יופנו רק למיזמים מתמשכים שהציבור נהנה מהם.",
    },
    {
      code: "FR-RESTRAINT-DEFAULT",
      fundTypeCode: "restitution",
      decision: "route_to_public_needs",
      priority: 60,
      halachicRuleCode: "HR-REST-002",
      note: "ברירת מחדל להשבת ממון ללא בעלים ידועים.",
    },
    {
      code: "FR-MAASER-RATE",
      fundTypeCode: "maaser",
      decision: "rate_10_percent",
      priority: 40,
      halachicRuleCode: "HR-MAASER-001",
      note: "שיעור המעשר ניתן לשינוי (מינימום/default).",
    },
  ];

  for (const fr of fundRules) {
    const hr = fr.halachicRuleCode
      ? await prisma.halachicRule.findUnique({ where: { code: fr.halachicRuleCode } })
      : null;
    await prisma.fundRule.upsert({
      where: { code: fr.code },
      update: {
        fundTypeCode: fr.fundTypeCode,
        decision: fr.decision,
        priority: fr.priority,
        halachicRuleId: hr?.id ?? null,
        note: fr.note,
      },
      create: {
        code: fr.code,
        fundTypeCode: fr.fundTypeCode,
        condition: "{}",
        decision: fr.decision,
        priority: fr.priority,
        halachicRuleId: hr?.id ?? null,
        note: fr.note,
      },
    });
  }

  // ---- FAQ ----
  const faqs: Array<{ slug: string; question: string; answer: string; category: string; sortOrder: number }> = [
    {
      slug: "what-if-i-know-owner",
      question: "מה אם אני יודע ממי לקחתי?",
      answer:
        "אם בעל הממון ידוע וניתן להגיע אליו — הדרך הנכונה היא להשיב לו את הממון עצמו, ולא לתרום אותו. נעזור לך לנסח פנייה מכבדת, ואם תרצה נלווה אותך עד ההשבה.",
      category: "restitution",
      sortOrder: 1,
    },
    {
      slug: "what-if-i-dont-know",
      question: "מה אם איני יודע ממי לקחתי?",
      answer:
        "כשבעל הממון אינו ידוע, הדרך המקובלת היא להפנות את הכסף לדברים שהציבור נהנה מהם — מיזמים מתמשכים. כך גם אם האדם שממנו נלקח אינו יודע על כך, הדבר מגיע לתועלתו.",
      category: "restitution",
      sortOrder: 2,
    },
    {
      slug: "dont-remember-amount",
      question: "אני לא זוכר בדיוק כמה כסף היה.",
      answer:
        "זה נפוץ. אפשר להעריך סכום סביר ולהוסיף מעט מרווח ביטחון כדי לצאת מן הספק. לא תצטרך לבחור מספר שרירותי — נעזור לך להעריך.",
      category: "restitution",
      sortOrder: 3,
    },
    {
      slug: "many-people",
      question: "מה אם היו אנשים רבים?",
      answer:
        "ממון שנגבה מאנשים רבים ואין לדעת ממי בדיוק — מושב דרך צרכי הרבים, באופן שהאדם שממנו נלקח עשוי ליהנות ממנו.",
      category: "restitution",
      sortOrder: 4,
    },
    {
      slug: "business-closed",
      question: "מה אם העסק כבר נסגר או שהאדם נפטר?",
      answer:
        "אם הבעלים אינו בנמצא ואין יורשים או נציג שניתן להשיב להם, מרכזים את ההשבה בדברים שהרבים נהנים מהם. יש מקרים שבהם ראוי לתת דווקא לצדקה — נברר יחד את הפרטים בלי לשאול יותר ממה שצריך.",
      category: "restitution",
      sortOrder: 5,
    },
    {
      slug: "old-case",
      question: "עשיתי משהו לפני 20 שנה ואיני זוכר למי — מה עושים?",
      answer:
        "גם מקרה ישן אפשר להסדיר. אין צורך להיזכר בכל הפרטים. נברר רק את מה שנדרש כדי לבחור את הדרך הנכונה, והכול בדיסקרטיות.",
      category: "restitution",
      sortOrder: 6,
    },
    {
      slug: "must-tell",
      question: "אני מתבייש לספר מה קרה. חייבים לספר?",
      answer:
        "לא. איננו בית דין ואיננו חוקרים. לא תצטרך לתאר מה קרה. נשאל רק את השאלות ההכרחיות כדי לבחור את המסלול הנכון.",
      category: "privacy",
      sortOrder: 7,
    },
    {
      slug: "someone-knows",
      question: "האם מישהו בעמותה יידע למה שילמתי?",
      answer:
        "אנחנו מצמצמים את המידע למינימום. במסלולים רגישים ניתן להשלים את התהליך באנונימיות, ואין שמירה של תוכן רגיש. מה שנדרש הוא רק מה שהסליקה או הדין מחייבים.",
      category: "privacy",
      sortOrder: 8,
    },
    {
      slug: "no-name",
      question: "האם אפשר לבצע את הכול ללא שם?",
      answer:
        "כן, במסלולים רבים ניתן לתרום באנונימיות. במצב דיסקרטי גם לא נאסוף נתוני שיווק או analytics.",
      category: "privacy",
      sortOrder: 9,
    },
    {
      slug: "maaser-compute",
      question: "כיצד מחשבים מעשר כספים?",
      answer:
        "נהוג להפריש עשירית מההכנסה. למנהג הספרדים זהו מנהג שיש לו תוקף. אפשר לחשב לפי הכנסות, ולפי הצורך לנכות הוצאות — נציג מחשבון שינחה אותך, וניתן לשנות את כללי החישוב.",
      category: "maaser",
      sortOrder: 10,
    },
    {
      slug: "maaser-vs-tzedakah",
      question: "מה ההבדל בין צדקה למעשר?",
      answer:
        "צדקה היא מצווה לתת לעניים לפי היכולת. מעשר כספים הוא מנהג להפריש עשירית מההכנסה. אפשר לשלב, אך אין לערבב ביניהם בלי החלטה מודעת.",
      category: "maaser",
      sortOrder: 11,
    },
    {
      slug: "public-needs-what",
      question: "מהם צרכי רבים?",
      answer:
        "דברים שהציבור כולו נהנה מהם באופן מתמשך — תשתית קהילתית, מרכז רוחני, תוכניות מתמשכות. זו קטגוריה נפרדת מ\"צדקה\", ומתאימה במיוחד להשבת ממון שאין לו בעלים ידועים.",
      category: "public_needs",
      sortOrder: 12,
    },
    {
      slug: "pidyon-what",
      question: "מהו פדיון נפש?",
      answer:
        "פדיון נפש הוא מנהג ישראל: נותנים צדקה, ואפשר לצרף שם ושם האם. אין סכום חובה — כל אחד לפי יכולתו, ויש הנוהגים 160 מטבעות כמניין \"כסף\".",
      category: "pidyon",
      sortOrder: 13,
    },
    {
      slug: "where-money",
      question: "למי הולך הכסף?",
      answer:
        "באזור \"לאן הכסף מגיע?\" אנחנו מפרסמים את המטרות, הפרויקטים וההתקדמות. כל שקל משויך לסוג קופה מוגדר, ואין עירוב בין הקטגוריות בלי כלל מפורש.",
      category: "trust",
      sortOrder: 14,
    },
  ];

  for (const f of faqs) {
    await prisma.faq.upsert({
      where: { slug: f.slug },
      update: { question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder },
      create: f,
    });
  }

  // ---- Articles ----
  const articles = [
    {
      slug: "hashavat-mamon-guide",
      title: "השבת ממון — מדריך קצר",
      excerpt: "מה עושים עם ממון שאין למי להשיב.",
      category: "restitution",
      body: "כאשר בעל הממון ידוע וניתן להגיע אליו — משיבים לו את הממון עצמו. כאשר אינו ידוע, הדרך המקובלת היא לעשות בצרכי הרבים, באופן שהנגזל או יורשיו עשויים ליהנות מהם. ההשבה נעשית בדיסקרטיות.",
      published: true,
    },
    {
      slug: "about-maaser",
      title: "מעשר כספים — מה, כמה, ולמה",
      excerpt: "עשירית מההכנסה, לפי מנהג.",
      category: "maaser",
      body: "מעשר כספים הוא מנהג להפריש עשירית מההכנסה. לדעת הרמ\"א יש בו תוקף חיוב; למנהג הספרדים זהו מנהג מחייב, ומי שאינו מפריש נחשב \"עין רעה\". את כללי החישוב ניתן להתאים למצבך.",
      published: true,
    },
    {
      slug: "pidyon-nefesh",
      title: "פדיון נפש — מנהג וכוונה",
      excerpt: "מהות המנהג ואופן ביצועו.",
      category: "pidyon",
      body: "פדיון נפש הוא מנהג ישראל. נותנים צדקה ואפשר לצרף שם ושם האם. אין סכום חובה; ויש הנוהגים 160 מטבעות כמניין \"כסף\".",
      published: true,
    },
    {
      slug: "privacy-commitment",
      title: "הפרטיות שלך",
      excerpt: "כמה מידע אנחנו באמת צריכים — ומה אנחנו לא שומרים.",
      category: "privacy",
      body: "אנחנו אוספים את המינימום ההכרחי. במצב דיסקרטי אין analytics ואין cookies שיווקיים. אין שמירה של תוכן רגיש, ואין צורך להירשם כדי לפעול.",
      published: true,
    },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: { title: a.title, excerpt: a.excerpt, body: a.body, category: a.category, published: a.published, publishedAt: new Date() },
      create: { ...a, publishedAt: new Date() },
    });
  }

  // ---- Settings ----
  const settings: Array<[string, unknown]> = [
    ["brand.name", "הקופה הלאומית"],
    ["brand.tagline", "להשיב, לתקן ולתת"],
    ["brand.operator", "הקופה הלאומית מופעלת באמצעות עמותת חסד יסובבנו"],
    ["org.name", "עמותת חסד יסובבנו"],
    ["org.president", 'בנשיאות הרב שלום יוסף ברבי, נתיבות'],
    ["org.city", "נתיבות"],
    ["halacha.disclaimer", "ההסברים מבוססים על מקורות שפורסמו ונבדקו. במקרה אישי מורכב — כדאי להתייעץ עם רב."],
    ["halacha.default_status_visible", "true"],
    ["pidyon.default_amount_agorot", 18000],
    ["pidyon.formula_note", "אין סכום חובה. יש הנוהגים 160 מטבעות כמניין \"כסף\"."],
    ["privacy.discreet_default", "false"],
    ["receipts.tax_note", "לא מוצהר על הטבת מס אלא אם סטטוס העמותה מאפשר זאת."],
    ["payments.provider", env.PAYMENTS_PROVIDER],
  ];
  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }

  // ---- QR codes ----
  const qr = [
    { code: "qr_home", slug: "home", destination: "/", source: "print-home" },
    { code: "qr_restore", slug: "restore", destination: "/hashavat-mamon", source: "beit-knesset" },
    { code: "qr_tzedakah", slug: "give", destination: "/tzedakah", source: "print-tzedakah" },
    { code: "qr_pidyon", slug: "pidyon", destination: "/pidyon", source: "print-pidyon" },
    { code: "qr_public", slug: "public", destination: "/tzrachei-rabim", source: "print-public" },
  ];
  for (const q of qr) {
    await prisma.qrCode.upsert({
      where: { slug: q.slug },
      update: { destination: q.destination, source: q.source },
      create: q,
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
