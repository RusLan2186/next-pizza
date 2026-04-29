import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // Bypass localtunnel password page for all requests
  response.headers.set("bypass-tunnel-reminder", "true");
  return response;
}

export const config = {
  matcher: "/:path*",
};
