/*
  Warnings:

  - You are about to drop the column `schedule_date` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_time` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `scheduled_at` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `departments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `departments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `schedule_date`,
    DROP COLUMN `schedule_time`,
    ADD COLUMN `scheduled_at` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `departments` MODIFY `code` VARCHAR(50) NOT NULL,
    MODIFY `name` VARCHAR(150) NOT NULL;

-- AddForeignKey
ALTER TABLE `department_schedule` ADD CONSTRAINT `department_schedule_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
