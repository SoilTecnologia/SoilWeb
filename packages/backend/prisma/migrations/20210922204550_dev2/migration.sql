/*
  Warnings:

  - Added the required column `updatedAt` to the `Cycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CycleState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CycleVariable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Intent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pivot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Radio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cycle` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `CycleState` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `CycleVariable` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Intent` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Pivot` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Radio` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
