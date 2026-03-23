/*
  Warnings:

  - A unique constraint covering the columns `[gameId,platformId,conditionId,regionId]` on the table `GameVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameVariant_gameId_platformId_conditionId_regionId_key" ON "GameVariant"("gameId", "platformId", "conditionId", "regionId");
