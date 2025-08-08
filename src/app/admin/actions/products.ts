"use server";

import { db } from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { notFound, redirect } from "next/navigation";
import { flattenError, z } from "zod";

const fileSchema = z.instanceof(File, { error: "Required" });

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export const addProduct = async (prevState: any, formData: FormData) => {
  const { success, error, data } = addSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!success) {
    return flattenError(error)?.fieldErrors;
  }

  const [fileBuffer, imageBuffer] = await Promise.all([
    data.file.arrayBuffer(),
    data.image.arrayBuffer(),
  ]);

  const [fileUpload, imageUpload] = await Promise.all([
    imagekit.upload({
      file: Buffer.from(fileBuffer),
      fileName: data.file.name,
      folder: "ecomm/files",
      useUniqueFileName: true,
    }),
    imagekit.upload({
      file: Buffer.from(imageBuffer),
      fileName: data.image.name,
      folder: "ecomm/images",
      useUniqueFileName: true,
    }),
  ]);

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      price: data.price,
      filePath: fileUpload.url,
      fileId: fileUpload.fileId,
      imagePath: imageUpload.url,
      imageId: imageUpload.fileId,
    },
  });

  redirect("/admin/products");
};

export const toggleProductAvailability = async (
  id: string,
  isAvailableForPurchase: boolean
) => {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
};

export const deleteProduct = async (id: string) => {
  const product = await db.product.findUnique({ where: { id } });

  if (!product) return notFound();

  const { fileId, imageId } = product;

  if (fileId && imageId) await imagekit.bulkDeleteFiles([fileId, imageId]);

  await db.product.delete({ where: { id } });
};

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export const updateProduct = async (
  id: string,
  prevState: any,
  formData: FormData
) => {
  const { success, error, data } = editSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!success) {
    return flattenError(error)?.fieldErrors;
  }

  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("Product not found.");
  }

  let filePath = product.filePath;
  let fileId = product.fileId;
  let imagePath = product.imagePath;
  let imageId = product.imageId;

  if (data.file != null && data.file.size > 0) {
    const fileBuffer = Buffer.from(await data.file.arrayBuffer());

    const fileUpload = await imagekit.upload({
      file: fileBuffer,
      fileName: data.file.name,
      folder: "ecomm/files",
      useUniqueFileName: true,
    });

    await imagekit.deleteFile(fileId);

    filePath = fileUpload.url;
    fileId = fileUpload.fileId;
  }

  if (data.image != null && data.image.size > 0) {
    const imageBuffer = Buffer.from(await data.image.arrayBuffer());

    const imageUpload = await imagekit.upload({
      file: imageBuffer,
      fileName: data.image.name,
      folder: "ecomm/images",
      useUniqueFileName: true,
    });

    await imagekit.deleteFile(imageId);

    imagePath = imageUpload.url;
    imageId = imageUpload.fileId;
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      filePath,
      imagePath,
      fileId,
      imageId,
    },
  });

  redirect("/admin/products");
};
