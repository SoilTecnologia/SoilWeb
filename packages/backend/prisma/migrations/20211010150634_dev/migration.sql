/*
  Warnings:

  - The primary key for the `Radio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `radio_name` to the `Radio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Node` MODIFY `node_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Radio` DROP PRIMARY KEY,
    ADD COLUMN `radio_name` VARCHAR(191) NOT NULL,
    MODIFY `radio_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`radio_id`);
