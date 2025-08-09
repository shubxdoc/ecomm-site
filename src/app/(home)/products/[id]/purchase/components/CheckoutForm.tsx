"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { formatCurrency } from "@/utils/formatters";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { userOrderExists } from "@/app/actions/orders";
import { useUser } from "@clerk/nextjs";

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    price: number;
    description: string;
  };
  clientSecret: string;
};

export const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  return (
    <>
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <div className="flex gap-4 items-center">
          <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-2xl">
              {formatCurrency(product.price / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">
              {product.description}
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm price={product.price} productId={product.id} />
        </Elements>
      </div>
    </>
  );
};

const PaymentForm = ({
  price,
  productId,
}: {
  price: number;
  productId: string;
}) => {
  const { user } = useUser();

  const existingEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState(existingEmail ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    if (existingEmail && existingEmail !== email) {
      setErrorMessage("Email cannot be changed for logged-in purchases.");
      return;
    }

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page"
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
          payment_method_data: {
            billing_details: {
              email: existingEmail || email,
            },
          },
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <PaymentElement />
          {!existingEmail && (
            <div className="mt-4">
              <LinkAuthenticationElement
                onChange={(e) => setEmail(e.value.email)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(price / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
