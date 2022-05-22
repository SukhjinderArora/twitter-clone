/*
  Warnings:

  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_postId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_userId_fkey";

-- DropTable
DROP TABLE "Reply";

-- CreateTable
CREATE TABLE "_PostReplies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostReplies_AB_unique" ON "_PostReplies"("A", "B");

-- CreateIndex
CREATE INDEX "_PostReplies_B_index" ON "_PostReplies"("B");

-- AddForeignKey
ALTER TABLE "_PostReplies" ADD CONSTRAINT "_PostReplies_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostReplies" ADD CONSTRAINT "_PostReplies_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
