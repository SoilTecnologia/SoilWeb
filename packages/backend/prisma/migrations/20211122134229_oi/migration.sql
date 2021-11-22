/*
  Warnings:

  - You are about to drop the column `radio_id` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the column `radio_name` on the `Intent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pivot_id]` on the table `Intent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pivot_id` to the `Intent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Intent` DROP FOREIGN KEY `Intent_radio_id_fkey`;

-- AlterTable
ALTER TABLE `Intent` DROP COLUMN `radio_id`,
    DROP COLUMN `radio_name`,
    ADD COLUMN `pivot_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Intent_pivot_id_key` ON `Intent`(`pivot_id`);

-- AddForeignKey
ALTER TABLE `Intent` ADD CONSTRAINT `Intent_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Radio` RENAME INDEX `Radio_pivot_id_unique` TO `Radio_pivot_id_key`;
