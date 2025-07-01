import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/upstash/redis";
import { medusa } from "@/utils/medusa";
import Stripe from "stripe";

const getPaymentIntent = async (paymentIntentId: string) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

const getCart = async (cartId: string) => {
  const response = await medusa.store.cart.retrieve(cartId);
  return response.cart;
};

export const POST = async (req: NextRequest) => {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = await redis.get(`checkout:${token}`);
  if (!data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const { paymentIntentId, cartId } = JSON.parse(data as string);
  if (!paymentIntentId || !cartId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const paymentIntent = await getPaymentIntent(paymentIntentId);
  const cart = await getCart(cartId);

  if (!paymentIntent || !cart) {
    return NextResponse.json({ error: "Error processing request" }, { status: 400 });
  }

  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  // process order in medusa
  const completed = await medusa.store.cart.complete(cartId);
  if (completed.type === "order" && completed.order) {
    const { order } = completed;
    await redis.del(`checkout:${token}`);
    return NextResponse.json({ order: { id: order.id } });
  }

  return NextResponse.json({ error: "Error completing order" }, { status: 400 });
};
