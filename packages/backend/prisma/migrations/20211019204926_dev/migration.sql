/*
  Warnings:

  - You are about to drop the column `date_off` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the column `date_on` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the column `end_angle` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the column `start_angle` on the `Intent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Intent` DROP COLUMN `date_off`,
    DROP COLUMN `date_on`,
    DROP COLUMN `end_angle`,
    DROP COLUMN `start_angle`;
