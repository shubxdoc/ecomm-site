"use server";

import { db } from "@/lib/db";

export const userOrderExists = async (email: string, productId: string) => {
  const order = db.order.findFirst({
    where: {
      user: {
        email,
      },
      productId,
    },
    select: {
      id: true,
    },
  });

  return order;
};
