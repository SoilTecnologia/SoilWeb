/*
  Warnings:

  - The values [MANAGER,ADMIN] on the enum `User_user_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_FarmToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_FarmToUser` DROP FOREIGN KEY `_FarmToUser_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_FarmToUser` DROP FOREIGN KEY `_FarmToUser_ibfk_2`;

-- AlterTable
ALTER TABLE `User` MODIFY `user_type` ENUM('SUDO', 'USER') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `_FarmToUser`;

-- CreateTable
CREATE TABLE `FarmUser` (
    `farm_user_id` VARCHAR(191) NOT NULL,
    `farm_user_type` ENUM('WORKER', 'MANAGER', 'ADMIN') NOT NULL,
    `farm_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`farm_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FarmUser` ADD CONSTRAINT `FarmUser_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarmUser` ADD CONSTRAINT `FarmUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
