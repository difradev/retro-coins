/*
  Warnings:

  - You are about to drop the column `rate` on the `Game` table. All the data in the column will be lost.
  - Added the required column `developedBy` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `PriceSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('USD', 'EUR');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "rate",
ADD COLUMN     "developedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PriceSnapshot" ADD COLUMN     "currency" "CurrencyCode" NOT NULL;
