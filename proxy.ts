import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["de", "en"] as const;
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  const language = request.headers.get("accept-language")?.toLowerCase();

  return language?.startsWith("de") ? "de" : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request)}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
