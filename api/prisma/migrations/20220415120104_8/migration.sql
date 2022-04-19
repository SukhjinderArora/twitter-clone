-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedPassword" VARCHAR(64) NOT NULL DEFAULT E'password';
