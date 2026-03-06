/*
  Warnings:

  - Added the required column `itemsCount` to the `PriceSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriceSnapshot" ADD COLUMN     "itemsCount" INTEGER NOT NULL;
