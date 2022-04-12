/*
  Warnings:

  - Added the required column `content` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "content" VARCHAR(255) NOT NULL;
