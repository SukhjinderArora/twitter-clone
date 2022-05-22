-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_parentPostId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "parentPostId" DROP NOT NULL,
ALTER COLUMN "parentPostId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
