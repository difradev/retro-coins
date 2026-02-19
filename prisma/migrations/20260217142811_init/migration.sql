-- CreateEnum
CREATE TYPE "PlatformCode" AS ENUM ('GB', 'GBC', 'GBA', 'NES', 'SNES', 'SMS', 'SMD');

-- CreateEnum
CREATE TYPE "ConditionCode" AS ENUM ('LOOSE', 'CIB', 'SEALED');

-- CreateEnum
CREATE TYPE "RegionCode" AS ENUM ('PAL', 'NTSC', 'JAP');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameVariant" (
    "id" SERIAL NOT NULL,
    "platformId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,

    CONSTRAINT "GameVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "code" "PlatformCode" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" SERIAL NOT NULL,
    "code" "ConditionCode" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "code" "RegionCode" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchDemand" (
    "id" SERIAL NOT NULL,
    "rawQuery" TEXT NOT NULL,
    "searchKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count7d" INTEGER NOT NULL,

    CONSTRAINT "SearchDemand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");

-- AddForeignKey
ALTER TABLE "GameVariant" ADD CONSTRAINT "GameVariant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameVariant" ADD CONSTRAINT "GameVariant_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameVariant" ADD CONSTRAINT "GameVariant_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameVariant" ADD CONSTRAINT "GameVariant_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
