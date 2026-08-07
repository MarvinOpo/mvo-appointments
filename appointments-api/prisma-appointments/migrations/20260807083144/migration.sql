/*
  Warnings:

  - You are about to drop the column `employee_dependent` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `employee_dependent`,
    ADD COLUMN `order_no` INTEGER NULL,
    ADD COLUMN `priority` VARCHAR(191) NOT NULL DEFAULT 'Regular';
