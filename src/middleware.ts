import { auth, isAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isApp = req.nextUrl.pathname.startsWith("/app");
  if (isApp && !req.auth) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  const isDataStudio = req.nextUrl.pathname.startsWith("/app/data");
  const isMediaStudio = req.nextUrl.pathname.startsWith("/app/media");
  const isR2 = req.nextUrl.pathname.startsWith("/app/r2");
  if ((isDataStudio || isMediaStudio || isR2) && !isAdminSession(req.auth)) {
    return NextResponse.redirect(new URL("/app", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*"],
};
