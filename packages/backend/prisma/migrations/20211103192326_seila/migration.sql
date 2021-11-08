/*
  Warnings:

  - You are about to drop the column `percentimenter` on the `Intent` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `Cycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `CycleState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `CycleVariable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentimeter` to the `Intent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Intent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `RadioVariable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cycle` ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `CycleState` ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `CycleVariable` ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Intent` DROP COLUMN `percentimenter`,
    ADD COLUMN `percentimeter` INTEGER NOT NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `RadioVariable` ADD COLUMN `timestamp` DATETIME(3) NOT NULL;
