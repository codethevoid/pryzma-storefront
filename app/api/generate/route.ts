import { NextRequest, NextResponse } from "next/server";
import { experimental_generateImage as generateImage } from "ai";
import { fireworks } from "@ai-sdk/fireworks";
import { ratelimiter } from "@/lib/upstash/rate-limit";
import { ipAddress } from "@vercel/functions";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }),
});

export const maxDuration = 30;

export const POST = async (req: NextRequest) => {
  try {
    const identifier = `generate:${ipAddress(req) || "127.0.0.1"}`;
    const { success } = await ratelimiter({ requests: 10, duration: "60 m" }).limit(identifier);
    if (!success) {
      return NextResponse.json(
        { error: "You can only generate 10 images per hour" },
        { status: 429 },
      );
    }

    const { prompt } = (await req.json()) as { prompt: string };

    const { success: validationSuccess } = schema.safeParse({ prompt });
    if (!validationSuccess) {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const { images } = await generateImage({
      model: fireworks.image("accounts/fireworks/models/stable-diffusion-xl-1024-v1-0"),
      prompt,
      aspectRatio: "1:1",
      size: "1024x1024",
    });

    const base64Images = images?.map((image) => {
      const base64 = Buffer.from(image.uint8Array).toString("base64");
      return `data:${image.mimeType};base64,${base64}`;
    });

    return NextResponse.json({ images: base64Images || [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
