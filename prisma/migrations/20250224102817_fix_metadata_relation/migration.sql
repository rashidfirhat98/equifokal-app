/*
  Warnings:

  - You are about to drop the column `model` on the `Metadata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_imageId_fkey";

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "model";

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
