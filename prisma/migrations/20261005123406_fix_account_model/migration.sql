/*
  Warnings:

  - You are about to drop the column `id` on the `Account` table. All the data in the column will be lost.
  - Made the column `userId` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL;
