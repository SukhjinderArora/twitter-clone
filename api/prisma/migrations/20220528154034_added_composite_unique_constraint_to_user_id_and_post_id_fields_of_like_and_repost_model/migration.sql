/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,userId]` on the table `Repost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_postId_key";

-- DropIndex
DROP INDEX "Repost_postId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "Like"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Repost_postId_userId_key" ON "Repost"("postId", "userId");
