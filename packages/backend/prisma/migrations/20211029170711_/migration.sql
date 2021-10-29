/*
  Warnings:

  - You are about to drop the column `pivot_id` on the `Intent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[radio_id]` on the table `Intent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `radio_id` to the `Intent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radio_name` to the `Intent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Intent` DROP FOREIGN KEY `Intent_pivot_id_fkey`;

-- AlterTable
ALTER TABLE `Intent` DROP COLUMN `pivot_id`,
    ADD COLUMN `radio_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `radio_name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Intent_radio_id_key` ON `Intent`(`radio_id`);

-- AddForeignKey
ALTER TABLE `Intent` ADD CONSTRAINT `Intent_radio_id_fkey` FOREIGN KEY (`radio_id`) REFERENCES `Radio`(`radio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
