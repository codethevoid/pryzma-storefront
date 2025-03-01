import { NextResponse, NextRequest } from "next/server";
import { medusa } from "@/utils/medusa";
import { StoreProductListResponse } from "@medusajs/types";

export const GET = async (req: NextRequest) => {
  try {
    const url = req.nextUrl;
    const query = url.searchParams.get("q") || "";

    const response: StoreProductListResponse = await medusa.store.product.list({
      q: query,
      limit: 10,
      fields: "*variants.calculated_price",
    });

    return NextResponse.json(response.products || []);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
