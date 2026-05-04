import { NextRequest, NextResponse } from "next/server";

// Backward-compatibility: old links that pointed directly to this API route
// are redirected to the verify-email page where the user enters the code.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const query = code ? `?code=${encodeURIComponent(code)}` : "";

  return NextResponse.redirect(new URL(`/verify-email${query}`, request.url));
}
