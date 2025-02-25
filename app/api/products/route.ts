import { NextResponse, NextRequest } from "next/server";
import { medusa } from "@/utils/medusa";
import { buildTagFilters } from "@/lib/helpers/build-tag-filters";

export const GET = async (req: NextRequest) => {
  try {
    const url = req.nextUrl;
    const categoryId = url.searchParams.get("category_id") || "";
    const collectionId = url.searchParams.get("collection_id") || "";
    const filters = url.searchParams.get("filters") || "[]";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("page_size") || "24", 10);

    const response = await medusa.store.product.list({
      ...(categoryId && {
        category_id: categoryId?.includes(",") ? categoryId.split(",") : categoryId,
      }),
      ...(collectionId && {
        collection_id: collectionId?.includes(",") ? collectionId.split(",") : collectionId,
      }),
      limit: pageSize,
      offset: page === 1 ? 0 : (page - 1) * pageSize,
      ...buildTagFilters(JSON.parse(filters)),
      fields: "*variants.calculated_price",
    });

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
