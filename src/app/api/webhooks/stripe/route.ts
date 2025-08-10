import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaid = charge.amount;

    const product = await db.product.findUnique({ where: { id: productId } });
    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: {
        email,
        orders: { create: { productId, pricePaid } },
      },
      update: {
        orders: { create: { productId, pricePaid } },
      },
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      html: `
  <h2 style="color: slate;">Order #${order.id}</h2>
  <p>${order.createdAt.toDateString()} - $${(order.pricePaid / 100).toFixed(
        2
      )}</p>
  <h3>${product.name}</h3>
  <p>${product.description}</p>
`,
    });
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
