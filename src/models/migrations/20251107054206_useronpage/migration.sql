/*
  Warnings:

  - You are about to drop the column `roleId` on the `useronpage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `useronpage` DROP FOREIGN KEY `Useronpage_roleId_fkey`;

-- AlterTable
ALTER TABLE `useronpage` DROP COLUMN `roleId`;
