/*
  Warnings:

  - You are about to drop the column `tittle` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "tittle",
ADD COLUMN     "title" TEXT;
