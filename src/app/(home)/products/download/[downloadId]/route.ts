import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadId: string }> }
) {
  const { downloadId } = await params;

  const data = await db.downloadVerification.findUnique({
    where: { id: downloadId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true } } },
  });

  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }

  const fileName = data?.product.filePath.split("/").pop();

  const res = await fetch(data.product.filePath);
  if (!res.ok) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = await res.arrayBuffer();

  return new NextResponse(Buffer.from(fileBuffer), {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": fileBuffer.byteLength.toString(),
    },
  });
}
