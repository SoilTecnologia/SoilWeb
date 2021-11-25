-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_type` ENUM('SUDO', 'USER') NOT NULL DEFAULT 'USER',

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
CREATE TABLE `FarmUser` (
    `farm_user_id` VARCHAR(191) NOT NULL,
    `farm_user_type` ENUM('WORKER', 'MANAGER', 'ADMIN') NOT NULL,
    `farm_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`farm_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Node` (
    `node_id` VARCHAR(191) NOT NULL,
    `node_name` VARCHAR(191) NOT NULL,
    `isGPRS` BOOLEAN NOT NULL,
    `farm_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`node_id`)
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
    `node_id` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`pivot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cycle` (
    `cycle_id` VARCHAR(191) NOT NULL,
    `is_running` BOOLEAN NOT NULL DEFAULT true,
    `pivot_id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`cycle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intent` (
    `intent_id` VARCHAR(191) NOT NULL,
    `power` ENUM('NULL', 'ON', 'OFF') NOT NULL,
    `water` ENUM('NULL', 'DRY', 'WET') NOT NULL,
    `direction` ENUM('NULL', 'CLOCKWISE', 'ANTI_CLOCKWISE') NOT NULL,
    `percentimeter` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `pivot_id` VARCHAR(191) NOT NULL,
    `pivot_name` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Intent_pivot_id_key`(`pivot_id`),
    PRIMARY KEY (`intent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Radio` (
    `radio_id` VARCHAR(191) NOT NULL,
    `radio_name` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `pivot_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Radio_pivot_id_key`(`pivot_id`),
    PRIMARY KEY (`radio_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RadioVariable` (
    `radio_variable_id` VARCHAR(191) NOT NULL,
    `rssi` INTEGER NOT NULL DEFAULT 0,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `father` VARCHAR(191) NOT NULL DEFAULT 'null',
    `payload` VARCHAR(191) NOT NULL DEFAULT 'oi',
    `timestamp` DATETIME(3) NOT NULL,
    `updateAt` DATETIME(3) NOT NULL,
    `radio_id` VARCHAR(191) NOT NULL,
    `radio_name` VARCHAR(191) NOT NULL,
    `response_time` DOUBLE NOT NULL,

    PRIMARY KEY (`radio_variable_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CycleState` (
    `cycle_state_id` VARCHAR(191) NOT NULL,
    `water` ENUM('NULL', 'DRY', 'WET') NOT NULL,
    `direction` ENUM('NULL', 'CLOCKWISE', 'ANTI_CLOCKWISE') NOT NULL,
    `connection` ENUM('ONLINE', 'OFFLINE') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `start_angle` INTEGER NOT NULL,
    `end_angle` INTEGER NOT NULL,
    `cycle_id` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`cycle_state_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CycleVariable` (
    `cycle_variable_id` VARCHAR(191) NOT NULL,
    `angle` INTEGER NOT NULL,
    `percentimeter` INTEGER NOT NULL,
    `pressure` INTEGER NOT NULL,
    `cycle_state_id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `cycle_id` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`cycle_variable_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FarmUser` ADD CONSTRAINT `FarmUser_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarmUser` ADD CONSTRAINT `FarmUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Node` ADD CONSTRAINT `Node_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pivot` ADD CONSTRAINT `Pivot_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `Node`(`node_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cycle` ADD CONSTRAINT `Cycle_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intent` ADD CONSTRAINT `Intent_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Radio` ADD CONSTRAINT `Radio_pivot_id_fkey` FOREIGN KEY (`pivot_id`) REFERENCES `Pivot`(`pivot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadioVariable` ADD CONSTRAINT `RadioVariable_radio_id_fkey` FOREIGN KEY (`radio_id`) REFERENCES `Radio`(`radio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleState` ADD CONSTRAINT `CycleState_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleVariable` ADD CONSTRAINT `CycleVariable_cycle_state_id_fkey` FOREIGN KEY (`cycle_state_id`) REFERENCES `CycleState`(`cycle_state_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleVariable` ADD CONSTRAINT `CycleVariable_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
