-- AlterTable
ALTER TABLE `RadioVariable` ADD COLUMN `radio_name` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `response_time` DOUBLE NOT NULL DEFAULT -1;
