import { medusa } from "@/utils/medusa";
import { NextResponse, NextRequest } from "next/server";
import { AdminOrder, PaymentCollectionDTO } from "@medusajs/types";
import Stripe from "stripe";

type CustomAdminOrder = AdminOrder & {
  fulfillments?: {
    labels?: {
      tracking_number: string;
    }[];
  }[];
};

const getPaymentMethod = async (payment_method_id: string) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
  return paymentMethod?.card;
};

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const [orderRes, adminOrderRes] = await Promise.all([
      medusa.store.order.retrieve(id, {
        fields:
          "*items.variant,*items.variant.options,*items.product.options,*items.product.variants,*shipping_methods",
      }),
      medusa.admin.order.retrieve(id, {
        fields:
          "*fulfillments,*fulfillments.labels,*payment_collections,*payment_collections.payments,*payment_collections.payments.data",
      }),
    ]);

    const paymentMethod = await getPaymentMethod(
      (adminOrderRes.order as CustomAdminOrder).payment_collections?.[0]?.payments?.[0]?.data
        ?.payment_method as string,
    );

    return NextResponse.json({
      order: orderRes.order,
      tracking:
        (adminOrderRes.order as CustomAdminOrder).fulfillments?.[0]?.labels?.[0]?.tracking_number ||
        null,
      paymentMethod,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error && e.message.includes("Order id not found")) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
