import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";

export const GET = async (req: NextRequest, context: { params: Promise<{ slug: string }> }) => {
  try {
    const { params } = context;
    const { slug } = await params;

    const link = await prisma.link.findUnique({
      where: { slug },
      select: { url: true },
    });

    if (!link || !link.url) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ url: link.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
