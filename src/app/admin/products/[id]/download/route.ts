import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true },
  });

  const fileName = product?.filePath.split("/").pop();

  if (!product) return notFound();

  const res = await fetch(product.filePath);
  if (!res.ok) return notFound();

  const fileBuffer = await res.arrayBuffer();

  return new NextResponse(Buffer.from(fileBuffer), {
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": fileBuffer.byteLength.toString(),
    },
  });
}
