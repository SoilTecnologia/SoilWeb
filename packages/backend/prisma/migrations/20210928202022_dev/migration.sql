/*
  Warnings:

  - You are about to drop the column `farm_id` on the `Pivot` table. All the data in the column will be lost.
  - Added the required column `node_id` to the `Pivot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Pivot` DROP FOREIGN KEY `Pivot_farm_id_fkey`;

-- AlterTable
ALTER TABLE `Pivot` DROP COLUMN `farm_id`,
    ADD COLUMN `node_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Node` (
    `node_id` INTEGER NOT NULL,
    `isGPRS` BOOLEAN NOT NULL,
    `farm_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`node_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Node` ADD CONSTRAINT `Node_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pivot` ADD CONSTRAINT `Pivot_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `Node`(`node_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
