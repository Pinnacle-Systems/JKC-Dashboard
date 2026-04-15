-- AlterTable
ALTER TABLE `role` ADD COLUMN `compId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_compId_fkey` FOREIGN KEY (`compId`) REFERENCES `Useroncompany`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
