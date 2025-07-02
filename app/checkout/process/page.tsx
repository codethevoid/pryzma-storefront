import { redirect } from "next/navigation";
import { ProcessOrderClient } from "@/app/checkout/process/client";
import { redis } from "@/lib/upstash/redis";

type SearchParams = Promise<{ token: string }>;

const CheckoutProcessOrderPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { token } = await searchParams;
  if (!token) return redirect("/checkout");

  const exists = await redis.exists(`checkout:${token}`);
  if (!exists) return redirect("/checkout");

  return (
    <div className="flex h-[calc(100vh-375px)] min-h-[250px] items-center justify-center">
      <ProcessOrderClient token={token} />
    </div>
  );
};

export default CheckoutProcessOrderPage;
