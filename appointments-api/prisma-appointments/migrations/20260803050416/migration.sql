/*
  Warnings:

  - You are about to drop the `queue_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `queue_session_stat` DROP FOREIGN KEY `queue_session_stat_queue_session_id_fkey`;

-- DropTable
DROP TABLE `queue_session`;

-- CreateTable
CREATE TABLE `queue_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_id` INTEGER NOT NULL,
    `session_date` DATE NOT NULL,
    `has_started` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `queue_sessions_dept_id_session_date_key`(`dept_id`, `session_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `queue_session_stat` ADD CONSTRAINT `queue_session_stat_queue_session_id_fkey` FOREIGN KEY (`queue_session_id`) REFERENCES `queue_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
