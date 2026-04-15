-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rolename` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `Role_rolename_key`(`rolename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NULL,
    `username` VARCHAR(191) NULL,
    `employeeId` INTEGER NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `password` VARCHAR(191) NULL,
    `COMPCODE` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Useroncompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Useronpage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `read` BOOLEAN NULL DEFAULT false,
    `create` BOOLEAN NULL DEFAULT false,
    `edit` BOOLEAN NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `delete` BOOLEAN NULL DEFAULT false,
    `isdefault` BOOLEAN NULL DEFAULT false,
    `userId` INTEGER NULL,
    `roleId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Useroncompany` ADD CONSTRAINT `Useroncompany_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Useronpage` ADD CONSTRAINT `Useronpage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Useronpage` ADD CONSTRAINT `Useronpage_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
