/*
  Warnings:

  - You are about to drop the column `power` on the `CycleState` table. All the data in the column will be lost.
  - The values [NULL] on the enum `Intent_power` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `CycleState` DROP COLUMN `power`;

-- AlterTable
ALTER TABLE `Intent` MODIFY `power` ENUM('ON', 'OFF') NOT NULL;
