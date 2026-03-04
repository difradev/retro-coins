-- CreateTable
CREATE TABLE "GameSuggestion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "GameSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSuggestion_title_key" ON "GameSuggestion"("title");
