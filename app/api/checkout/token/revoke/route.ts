import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/upstash/redis";

export const POST = async (req: NextRequest) => {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  await redis.del(`checkout:${token}`);
  return NextResponse.json({ success: true }, { status: 200 });
};
