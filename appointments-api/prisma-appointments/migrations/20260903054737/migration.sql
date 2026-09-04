-- AlterTable
ALTER TABLE `departments` ADD COLUMN `allowed_gender` ENUM('M', 'F') NULL,
    ADD COLUMN `max_age` INTEGER NULL,
    ADD COLUMN `min_age` INTEGER NULL;
