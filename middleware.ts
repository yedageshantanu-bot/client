import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
