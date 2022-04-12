/*
  Warnings:

  - You are about to drop the `Followee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FolloweeToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FollowerToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FolloweeToUser" DROP CONSTRAINT "_FolloweeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FolloweeToUser" DROP CONSTRAINT "_FolloweeToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_FollowerToUser" DROP CONSTRAINT "_FollowerToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FollowerToUser" DROP CONSTRAINT "_FollowerToUser_B_fkey";

-- DropTable
DROP TABLE "Followee";

-- DropTable
DROP TABLE "Follower";

-- DropTable
DROP TABLE "_FolloweeToUser";

-- DropTable
DROP TABLE "_FollowerToUser";

-- CreateTable
CREATE TABLE "Follow" (
    "followerId" INTEGER NOT NULL,
    "followeeId" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
