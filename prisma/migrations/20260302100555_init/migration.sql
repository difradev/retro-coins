-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" SERIAL NOT NULL,
    "gameVariantId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_gameVariantId_fkey" FOREIGN KEY ("gameVariantId") REFERENCES "GameVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
