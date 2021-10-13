/*
  Warnings:

  - Added the required column `cycle_id` to the `CycleVariable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CycleVariable` ADD COLUMN `cycle_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `CycleVariable` ADD CONSTRAINT `CycleVariable_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
