/*
  Warnings:

  - You are about to drop the column `father` on the `Radio` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Radio` table. All the data in the column will be lost.
  - You are about to drop the column `rssi` on the `Radio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Radio` DROP COLUMN `father`,
    DROP COLUMN `rank`,
    DROP COLUMN `rssi`;

-- CreateTable
CREATE TABLE `RadioVariable` (
    `radio_variable_id` VARCHAR(191) NOT NULL,
    `rssi` INTEGER NOT NULL DEFAULT 0,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `father` VARCHAR(191) NOT NULL DEFAULT 'null',
    `updateAt` DATETIME(3) NOT NULL,
    `radio_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`radio_variable_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RadioVariable` ADD CONSTRAINT `RadioVariable_radio_id_fkey` FOREIGN KEY (`radio_id`) REFERENCES `Radio`(`radio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
