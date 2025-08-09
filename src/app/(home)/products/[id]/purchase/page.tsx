import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { notFound } from "next/navigation";
import { CheckoutForm } from "./components/CheckoutForm";

export default async function PurchasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({ where: { id } });

  if (!product) return notFound();

  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: product.price,
    currency: "USD",
    metadata: { productId: product.id },
    automatic_payment_methods: { enabled: true },
  });

  if (!clientSecret) {
    throw Error("Stripe failed to create payment intent");
  }

  return <CheckoutForm product={product} clientSecret={clientSecret} />;
}
