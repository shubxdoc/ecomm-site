import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency } from "@/utils/formatters";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId)
    return (
      <div className="font-semibold text-2xl">
        *Sign In to view your order history
      </div>
    );

  const orders = await db.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: {
        include: {
          downloadVerifications: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (orders.length == 0) return <div>No orders yet</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map(({ product }) => {
        const downloadId = product.downloadVerifications[0]?.id;

        return (
          <Card key={product.id} className="max-w-lg">
            <div className="relative aspect-video">
              <Image
                src={product.imagePath}
                alt={product.name}
                fill
                sizes="(max-width: 200px)"
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                {formatCurrency(product.price / 100)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-4">{product.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                size="lg"
                className="w-full"
                variant="secondary"
                disabled={!downloadId}
              >
                <Link href={`/products/download/${downloadId}`}>Download</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
