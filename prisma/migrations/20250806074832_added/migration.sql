/*
  Warnings:

  - Added the required column `fileId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "fileId" TEXT NOT NULL,
ADD COLUMN     "imageId" TEXT NOT NULL;
