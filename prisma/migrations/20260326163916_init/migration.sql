/*
  Warnings:

  - The values [JAP] on the enum `RegionCode` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `variantCover` to the `GameVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegionCode_new" AS ENUM ('PAL', 'NTSC', 'NTSC_J');
ALTER TABLE "Region" ALTER COLUMN "code" TYPE "RegionCode_new" USING ("code"::text::"RegionCode_new");
ALTER TYPE "RegionCode" RENAME TO "RegionCode_old";
ALTER TYPE "RegionCode_new" RENAME TO "RegionCode";
DROP TYPE "public"."RegionCode_old";
COMMIT;

-- AlterTable
ALTER TABLE "GameVariant" ADD COLUMN     "variantCover" TEXT NOT NULL;
