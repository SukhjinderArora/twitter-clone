/*
  Warnings:

  - You are about to drop the `_PostReplies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostReplies" DROP CONSTRAINT "_PostReplies_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostReplies" DROP CONSTRAINT "_PostReplies_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "parentPostId" INTEGER NOT NULL DEFAULT 55;

-- DropTable
DROP TABLE "_PostReplies";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
