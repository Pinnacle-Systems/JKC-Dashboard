/*
  Warnings:

  - You are about to drop the column `compId` on the `role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_compId_fkey`;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `compId`;
