import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/upstash/redis";

export const POST = async (req: NextRequest) => {
  const { paymentIntentId, cartId } = await req.json();

  if (!paymentIntentId || !cartId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const token = nanoid(16);

  await redis.set(`checkout:${token}`, JSON.stringify({ paymentIntentId, cartId }), { ex: 86400 });
  return NextResponse.json({ token });
};
