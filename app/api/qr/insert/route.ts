import { NextResponse, NextRequest, after } from "next/server";
import prisma from "@/db/prisma";
import { redis } from "@/lib/upstash/redis";
import { ipAddress } from "@vercel/functions";

type RequestBody = {
  qrCodeValue: string;
  template: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const { qrCodeValue, template } = (await req.json()) as RequestBody;

    if (!qrCodeValue || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof qrCodeValue !== "string" && typeof template !== "string") {
      return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
    }

    // dont track duplicates from the same ip within 5 minutes
    const ip = ipAddress(req);
    if (!ip) {
      return NextResponse.json({ error: "No ip detected, skipping..." }, { status: 400 });
    }
    const exists = await redis.get(`qr:${qrCodeValue.trim()}:${ip}`);
    if (exists) {
      return NextResponse.json({ message: "QR code duplicate, skipping..." }, { status: 200 });
    }

    await redis.set(`qr:${qrCodeValue.trim()}:${ip}`, "1", { ex: 300 });

    after(async () => {
      await prisma.qrCode.create({
        data: {
          value: qrCodeValue.trim(),
          template,
        },
      });
    });

    return NextResponse.json({ message: "QR code inserted successfully" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
