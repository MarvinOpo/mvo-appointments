/*
  Warnings:

  - You are about to drop the column `departments` on the `user_access` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_access` DROP COLUMN `departments`,
    ADD COLUMN `dept_ids` JSON NULL;
