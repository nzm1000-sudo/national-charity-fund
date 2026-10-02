import { execSync } from "node:child_process";
import { existsSync, renameSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * Builds the static GitHub Pages preview of הקופה הלאומית.
 *
 * Pages can only serve static files, so this build:
 *   1. temporarily moves server-only routes aside (api, admin, mock, q,
 *      donation, proxy) — they need a Node host and are served by Vercel,
 *   2. creates + seeds the SQLite database so pages can render real content
 *      at build time,
 *   3. runs `next build` with output: 'export' into ./out,
 *   4. restores everything.
 *
 * The full app is unaffected; run `npm run build` for it.
 */

const root = process.cwd();
const stash = join(root, ".pages-exclude");

const SERVER_ONLY = [
  "src/app/api",
  "src/app/admin",
  "src/app/mock",
  "src/app/q",
  "src/app/donation",
  "src/proxy.ts",
];

function rel(p) {
  return join(root, p);
}

function moveAside() {
  rmSync(stash, { recursive: true, force: true });
  mkdirSync(stash, { recursive: true });
  for (const p of SERVER_ONLY) {
    if (existsSync(rel(p))) {
      renameSync(rel(p), join(stash, p.replace(/\//g, "__")));
    }
  }
}

function restore() {
  for (const p of SERVER_ONLY) {
    const stashed = join(stash, p.replace(/\//g, "__"));
    if (existsSync(stashed)) renameSync(stashed, rel(p));
  }
  rmSync(stash, { recursive: true, force: true });
}

// Derive Pages URL + base path (project pages live at /<repo>).
const ghRepo = process.env.GITHUB_REPOSITORY || "nzm1000-sudo/national-charity-fund";
const [owner, repo] = ghRepo.split("/");
const basePath = process.env.PAGES_BASE_PATH || `/${repo}`;
const appUrl = process.env.PAGES_APP_URL || `https://${owner}.github.io${basePath}`;

process.env.STATIC_EXPORT = "1";
process.env.PAGES_BASE_PATH = basePath;
process.env.NEXT_PUBLIC_STATIC_DEMO = "1";
process.env.APP_URL = appUrl;
process.env.NODE_ENV = "production";
// CI has no .env — provide build-only defaults. These are not secrets: the
// static preview has no server, database or admin at runtime.
process.env.DATABASE_URL ||= "file:./dev.db";
process.env.SESSION_SECRET ||= "pages-build-only-secret-000000000000";
process.env.ADMIN_BOOTSTRAP_EMAIL ||= "admin@example.org";
process.env.ADMIN_BOOTSTRAP_PASSWORD ||= "ChangeMe123!";

console.log(`→ Static Pages build  basePath=${basePath}  appUrl=${appUrl}`);

try {
  moveAside();
  console.log("→ Preparing database (build-time content)…");
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });
  execSync("npx prisma db seed", { stdio: "inherit", env: process.env });

  console.log("→ next build (static export)…");
  execSync("npx next build", { stdio: "inherit", env: process.env });

  console.log("✅ Static export ready in ./out");
} finally {
  restore();
}
