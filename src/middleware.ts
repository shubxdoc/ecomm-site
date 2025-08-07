import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const auth = await isAuth(req);

  if (!auth) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

async function isAuth(req: NextRequest) {
  return Promise.resolve(false);
}

export const config = {
  matcher: [
    // Always run for Admin routes
    "/admin/:path*",
  ],
};
