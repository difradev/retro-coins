/*
  Warnings:

  - Added the required column `maxPrice` to the `PriceSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPrice` to the `PriceSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriceSnapshot" ADD COLUMN     "maxPrice" INTEGER NOT NULL,
ADD COLUMN     "minPrice" INTEGER NOT NULL;
