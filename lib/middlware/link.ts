import { NextRequest, NextResponse } from "next/server";
import { getUrlFromSlug } from "./utils/get-url-from-slug";

export const linkMiddleware = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const slug = path.split("/").pop() || "";

  if (!slug) {
    return NextResponse.redirect("https://pryzma.io");
  }

  // get url to redirect to from db
  return getUrlFromSlug(slug);
};
