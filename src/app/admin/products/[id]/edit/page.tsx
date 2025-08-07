import { db } from "@/lib/db";
import { PageHeader } from "../../../components/PageHeader";
import { ProductForm } from "../../components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({ where: { id } });

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
