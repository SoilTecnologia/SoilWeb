/*
  Warnings:

  - The primary key for the `CycleVariable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cycle_variable` on the `CycleVariable` table. All the data in the column will be lost.
  - Added the required column `power` to the `CycleState` table without a default value. This is not possible if the table is not empty.
  - The required column `cycle_variable_id` was added to the `CycleVariable` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `CycleState` ADD COLUMN `power` ENUM('NULL', 'ON', 'OFF') NOT NULL;

-- AlterTable
ALTER TABLE `CycleVariable` DROP PRIMARY KEY,
    DROP COLUMN `cycle_variable`,
    ADD COLUMN `cycle_variable_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`cycle_variable_id`);
