/*
  Warnings:

  - The primary key for the `Node` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `node_name` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Pivot` DROP FOREIGN KEY `Pivot_node_id_fkey`;

-- AlterTable
ALTER TABLE `Node` DROP PRIMARY KEY,
    ADD COLUMN `node_name` INTEGER NOT NULL,
    MODIFY `node_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`node_id`);

-- AlterTable
ALTER TABLE `Pivot` MODIFY `node_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Pivot` ADD CONSTRAINT `Pivot_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `Node`(`node_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
