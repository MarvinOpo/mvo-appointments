/*
  Warnings:

  - A unique constraint covering the columns `[department_id,scheduled_at,queue_no]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `queue_no` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `appointments_department_id_scheduled_at_queue_no_key` ON `appointments`(`department_id`, `scheduled_at`, `queue_no`);
