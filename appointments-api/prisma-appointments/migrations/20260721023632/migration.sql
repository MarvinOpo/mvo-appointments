/*
  Warnings:

  - You are about to drop the column `day` on the `department_schedule` table. All the data in the column will be lost.
  - Added the required column `days` to the `department_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `department_schedule` DROP COLUMN `day`,
    ADD COLUMN `days` JSON NOT NULL;
