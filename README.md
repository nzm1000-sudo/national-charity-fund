# הקופה הלאומית

**מערכת ארצית להשבת ממון, צרכי רבים, צדקה, מעשרות ופדיון נפש.**

הקופה הלאומית מופעלת באמצעות עמותת **חסד יסובבנו** (בנשיאות הרב שלום יוסף ברבי, נתיבות) ומשמשת כגוף המפעיל והסליקה.

## מה זה

לא "אתר תרומות" אלא פלטפורמה עם מנועים אמיתיים:

- **Money Restitution Engine** — מסלול מסודר למי שיש בידו ממון שאינו שלו ואינו יודע למי להשיב, כולל סכום שאינו ידוע ומקרים ישנים.
- **צרכי רבים** — קטגוריית קופה נפרדת מצדקה, למיזמים מתמשכים שהציבור נהנה מהם.
- **Halachic Rules Engine** — כל כלל הלכתי הוא נתון ניתן-לעריכה ב-Admin, עם מקורות, סטטוס ביטחון, וגרסאות. אין המצאת מקורות.
- **Allocation Engine** — כל שקל משויך לסוג קופה וליעד, עם הכלל והגרסה שהוחלו עליו.
- **Payments abstraction** — ספק סליקה ניתן-להחלפה; לא נשמרים פרטי כרטיס.
- **QR Engine** — כתובות מקוצרות בבעלותנו, עם סטטיסטיקת סריקות ללא זיהוי אישי.
- **מצב דיסקרטי** — ללא analytics וללא cookies שיווקיים.

## סטאק

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (RTL אמיתי) · Prisma 6 + SQLite (dev) → Postgres (prod) · jose (sessions) · Zod · Vitest.

## הרצה מקומית

```bash
npm install
cp .env.example .env      # עדכנו סודות לפני production
npm run setup             # prisma generate + db push + seed
npm run dev               # http://localhost:3000
```

משתמש הניהול הראשוני נוצר מה-`.env` (`ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD`).

## סקריפטים

| פקודה | תיאור |
|---|---|
| `npm run dev` | שרת פיתוח |
| `npm run build` | prisma generate + build לפרודקשן |
| `npm run typecheck` | בדיקת טיפוסים |
| `npm run lint` | ESLint |
| `npm test` | בדיקות יחידה (Vitest) |
| `npm run db:seed` | זריעת נתונים |
| `npm run db:studio` | Prisma Studio |

## מבנה

```
src/app            עמודים ציבוריים + /admin + API routes
src/components      UI, layout, flows
src/lib/domain      מנועים טהורים (fund-types, halacha, restitution, allocation)
src/lib             env, prisma, money, auth, rbac, rate-limit, discreet
src/server          services: donations, funds, halacha-repo, payments, audit, analytics
prisma              schema + seed
docs/               ARCHITECTURE.md, HALACHA.md
tests/              בדיקות יחידה
```

## הלכה

ההסברים מבוססים על מקורות שפורסמו ונבדקו, ומתועדים ב-`docs/HALACHA.md` ובמנוע ההלכה. מקורות מסומנים בסטטוס (`verified` / `strong_basis` / `disputed` / `provisional` / `needs_review`). מקום שיש מחלוקת — ההתנהגות מוגדרת ב-Admin ואינה Hardcoded.

## אבטחה ופרטיות

הצפנה בתעבורה (HSTS), CSP, CSRF/XSS protections, ולידציה בצד שרת, rate limiting, RBAC, יומן ביקורת. **אין** שמירת מספר כרטיס או CVV. אין שמירת תוכן רגיש. Data minimization כברירת מחדל.

## רישיון

© עמותת חסד יסובבנו · הקופה הלאומית. כל הזכויות שמורות.
