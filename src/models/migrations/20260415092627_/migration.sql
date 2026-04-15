/*
  Warnings:

  - You are about to drop the column `isLoggedIn` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_sessionId_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `isLoggedIn`,
    DROP COLUMN `sessionId`,
    ADD COLUMN `sessionToken` VARCHAR(191) NULL;
