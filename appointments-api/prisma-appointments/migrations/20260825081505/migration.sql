/*
  Warnings:

  - You are about to drop the `queue_monitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `queue_monitor`;

-- CreateTable
CREATE TABLE `queue_monitors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `dept_ids` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
