/*
  Warnings:

  - You are about to drop the column `updated_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to alter the column `scheduled_at` on the `appointments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `department_schedule` DROP FOREIGN KEY `department_schedule_dept_id_fkey`;

-- DropIndex
DROP INDEX `department_schedule_dept_id_fkey` ON `department_schedule`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `updated_at`,
    MODIFY `scheduled_at` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `department_schedule` ADD CONSTRAINT `department_schedule_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
