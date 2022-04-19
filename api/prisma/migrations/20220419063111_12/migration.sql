-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" VARCHAR(50),
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "hashedPassword" DROP NOT NULL;
