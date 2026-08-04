/*
  Warnings:

  - You are about to drop the column `can_manage_department` on the `access_rights` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `access_rights` DROP COLUMN `can_manage_department`,
    ADD COLUMN `can_manage_departments` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `department_assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `dept_id` INTEGER NOT NULL,

    UNIQUE INDEX `department_assignment_user_id_dept_id_key`(`user_id`, `dept_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
