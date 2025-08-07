"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/formatters";
import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { addProduct, updateProduct } from "../../actions/products";
import { Product } from "@prisma/client";
import Image from "next/image";

export const ProductForm = ({ product }: { product?: Product | null }) => {
  const [error, action] = useActionState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  const [price, setPrice] = useState<number | undefined>(product?.price);

  return (
    <form action={action} className="space-y-8 max-w-2xl">
      <div className="space-y-2 ">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && (
          <div className="text-sm text-destructive">{error.name}</div>
        )}
      </div>

      <div className="space-y-2 ">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          id="price"
          name="price"
          required
          value={price ?? ""}
          onChange={(e) => setPrice(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((price || 0) / 100)}
        </div>
        {error.price && (
          <div className="text-sm text-destructive">{error.price}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <div className="text-sm text-destructive">{error.description}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">
            {product.filePath?.split("/").pop()}
          </div>
        )}
        {error.file && (
          <div className="text-sm text-destructive">{error.file}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          required={product == null}
          accept="image/*"
        />
        {product != null && (
          <Image
            src={product.imagePath}
            height="300"
            width="300"
            alt="Product Image"
          />
        )}
        {error.image && (
          <div className="text-sm text-destructive">{error.image}</div>
        )}
      </div>

      <SubmitButton />
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving
        </>
      ) : (
        "Save Product"
      )}
    </Button>
  );
}
