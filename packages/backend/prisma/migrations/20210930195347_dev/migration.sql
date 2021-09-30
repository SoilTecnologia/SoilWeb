/*
  Warnings:

  - You are about to drop the column `cycle_id` on the `CycleVariable` table. All the data in the column will be lost.
  - Added the required column `cycle_state_id` to the `CycleVariable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CycleVariable` DROP FOREIGN KEY `CycleVariable_cycle_id_fkey`;

-- AlterTable
ALTER TABLE `CycleVariable` DROP COLUMN `cycle_id`,
    ADD COLUMN `cycle_state_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `CycleVariable` ADD CONSTRAINT `CycleVariable_cycle_state_id_fkey` FOREIGN KEY (`cycle_state_id`) REFERENCES `CycleState`(`cycle_state_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
