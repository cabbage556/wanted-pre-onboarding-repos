/*
  Warnings:

  - You are about to drop the column `title` on the `JobPosting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobPosting" DROP COLUMN "title",
ALTER COLUMN "position" SET DATA TYPE VARCHAR(100);
