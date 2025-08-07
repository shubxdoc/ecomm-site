import { Button } from "@/components/ui/button";
import { PageHeader } from "../components/PageHeader";
import Link from "next/link";
import { ProductsTable } from "./components/ProductsTable";

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader>
        <div className="flex items-center justify-between">
          Products{" "}
          <Button asChild>
            <Link href={`/admin/products/new`}>Add Product</Link>
          </Button>
        </div>
      </PageHeader>

      <ProductsTable />
    </>
  );
}
