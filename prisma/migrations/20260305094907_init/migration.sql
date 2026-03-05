/*
  Warnings:

  - A unique constraint covering the columns `[searchKey]` on the table `SearchDemand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SearchDemand_searchKey_key" ON "SearchDemand"("searchKey");
