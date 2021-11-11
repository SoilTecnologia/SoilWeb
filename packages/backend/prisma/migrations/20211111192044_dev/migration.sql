-- AlterTable
ALTER TABLE `RadioVariable` ADD COLUMN `payload` VARCHAR(191) NOT NULL DEFAULT 'oi',
    ALTER COLUMN `radio_name` DROP DEFAULT,
    ALTER COLUMN `response_time` DROP DEFAULT;
