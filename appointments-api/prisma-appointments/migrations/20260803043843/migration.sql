-- CreateTable
CREATE TABLE `queue_session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_id` INTEGER NOT NULL,
    `session_date` DATE NOT NULL,
    `has_started` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `queue_session_dept_id_session_date_key`(`dept_id`, `session_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `queue_session_stat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `queue_session_id` INTEGER NOT NULL,
    `step` INTEGER NOT NULL,
    `served_count` INTEGER NOT NULL DEFAULT 0,
    `avg_seconds` DOUBLE NOT NULL DEFAULT 0,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `queue_session_stat_queue_session_id_step_key`(`queue_session_id`, `step`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `queue_session_stat` ADD CONSTRAINT `queue_session_stat_queue_session_id_fkey` FOREIGN KEY (`queue_session_id`) REFERENCES `queue_session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
