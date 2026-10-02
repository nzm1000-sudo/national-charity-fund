import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "kn_session";

/**
 * Proxy (formerly middleware) — protects every /admin route except the login
 * page. Verifies the session JWT at the edge before the request reaches any
 * admin page or server action.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE)?.value;
    let valid = false;
    if (token) {
      try {
        const secret = new TextEncoder().encode(
          process.env.SESSION_SECRET || "dev-only-change-me-0000000000",
        );
        await jwtVerify(token, secret);
        valid = true;
      } catch {
        valid = false;
      }
    }
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
