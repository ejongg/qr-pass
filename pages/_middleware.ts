import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.includes("admin")) {
    const isLoggedIn = req.cookies.access_token;
    const url = req.nextUrl.clone();

    if (!isLoggedIn && pathname !== "/admin/login") {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (isLoggedIn && ["/admin", "/admin/login"].includes(pathname)) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
