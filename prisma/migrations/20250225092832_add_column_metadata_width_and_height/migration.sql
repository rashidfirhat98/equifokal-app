/*
  Warnings:

  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Metadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Metadata` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `imageId` on the `Metadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_imageId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_pkey",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "width" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "imageId",
ADD COLUMN     "imageId" INTEGER NOT NULL,
ADD CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Metadata_imageId_key" ON "Metadata"("imageId");

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
