-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_type` ENUM('SUDO', 'USER', 'MANAGER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_login_key`(`login`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Farm` (
    `farm_id` VARCHAR(191) NOT NULL,
    `farm_name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `lng` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,
    `gateway` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`farm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pivot` (
    `pivot_id` VARCHAR(191) NOT NULL,
    `pivot_name` VARCHAR(191) NOT NULL,
    `lng` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,
    `start_angle` INTEGER NOT NULL,
    `end_angle` INTEGER NOT NULL,
    `radius` DOUBLE NOT NULL,
    `farm_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`pivot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cycle` (
    `cycle_id` VARCHAR(191) NOT NULL,
    `is_running` BOOLEAN NOT NULL,
    `pivot_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cycle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intent` (
    `intent_id` VARCHAR(191) NOT NULL,
    `power` ENUM('NULL', 'ON', 'OFF') NOT NULL,
    `water` ENUM('NULL', 'DRY', 'WET') NOT NULL,
    `direction` ENUM('NULL', 'CLOCKWISE', 'ANTI_CLOCKWISE') NOT NULL,
    `percentimenter` INTEGER NOT NULL,
    `start_angle` INTEGER NOT NULL,
    `end_angle` INTEGER NOT NULL,
    `date_on` DATETIME(3) NOT NULL,
    `date_off` DATETIME(3) NOT NULL,
    `pivot_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`intent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Radio` (
    `radio_id` INTEGER NOT NULL,
    `rssi` INTEGER NOT NULL,
    `rank` INTEGER NOT NULL,
    `father` VARCHAR(191) NOT NULL,
    `pivot_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Radio_pivot_id_key`(`pivot_id`),
    PRIMARY KEY (`radio_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CycleState` (
    `cycle_state_id` VARCHAR(191) NOT NULL,
    `water` ENUM('NULL', 'DRY', 'WET') NOT NULL,
    `direction` ENUM('NULL', 'CLOCKWISE', 'ANTI_CLOCKWISE') NOT NULL,
    `connection` ENUM('ONLINE', 'OFFLINE') NOT NULL,
    `start_angle` INTEGER NOT NULL,
    `end_angle` INTEGER NOT NULL,
    `cycle_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cycle_state_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CycleVariable` (
    `cycle_variable` VARCHAR(191) NOT NULL,
    `angle` INTEGER NOT NULL,
    `percentimeter` INTEGER NOT NULL,
    `pressure` INTEGER NOT NULL,
    `cycle_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cycle_variable`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FarmToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FarmToUser_AB_unique`(`A`, `B`),
    INDEX `_FarmToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pivot` ADD CONSTRAINT `Pivot_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cycle` ADD CONSTRAINT `Cycle_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intent` ADD CONSTRAINT `Intent_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Radio` ADD CONSTRAINT `Radio_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleState` ADD CONSTRAINT `CycleState_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleVariable` ADD CONSTRAINT `CycleVariable_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FarmToUser` ADD FOREIGN KEY (`A`) REFERENCES `Farm`(`farm_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FarmToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
