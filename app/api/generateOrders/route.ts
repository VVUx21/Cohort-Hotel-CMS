import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY as string,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export async function POST(req: Request) {
  const { amount } = await req.json();
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
  });

  return NextResponse.json(order);
}