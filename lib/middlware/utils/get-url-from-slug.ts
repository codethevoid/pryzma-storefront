import { NextResponse } from "next/server";
import { redis } from "@/lib/upstash/redis";

export const getUrlFromSlug = async (slug: string) => {
  try {
    // first check if slug is in redis cache
    const identifier = `link:${slug}`;
    const cachedUrl = await redis.get(identifier);

    if (cachedUrl) {
      return NextResponse.redirect(cachedUrl as string);
    }

    // if not in cache, check in db
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/url/${slug}`);

    if (!response.ok) {
      return NextResponse.redirect("https://pryzma.io");
    }

    const data = (await response.json()) as { url: string };

    // store in redis cache for future requests
    // set a TTL of 24 hours (86400 seconds)
    await redis.set(identifier, data.url, { ex: 86400 });
    return NextResponse.redirect(data.url);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect("https://pryzma.io");
  }
};
