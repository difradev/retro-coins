/*
  Warnings:

  - You are about to drop the column `code` on the `GameSuggestion` table. All the data in the column will be lost.
  - Added the required column `platformId` to the `GameSuggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `GameSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameSuggestion" DROP COLUMN "code",
ADD COLUMN     "platformId" INTEGER NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GameSuggestion" ADD CONSTRAINT "GameSuggestion_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
