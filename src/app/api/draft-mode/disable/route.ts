import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { disable } = await draftMode();
  disable();

  const redirectParam = request.nextUrl.searchParams.get("redirect");
  const referer = request.headers.get("referer");

  let redirectUrl: URL;

  if (redirectParam) {
    redirectUrl = new URL(redirectParam, request.url);
  } else if (referer) {
    try {
      redirectUrl = new URL(referer);
    } catch {
      redirectUrl = new URL("/", request.url);
    }
  } else {
    redirectUrl = new URL("/", request.url);
  }

  return NextResponse.redirect(redirectUrl);
}
