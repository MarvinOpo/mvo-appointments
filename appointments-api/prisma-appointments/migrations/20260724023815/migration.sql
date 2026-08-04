/*
  Warnings:

  - You are about to alter the column `scheduled_at` on the `appointments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `appointments` MODIFY `step` INTEGER NOT NULL DEFAULT 1,
    MODIFY `scheduled_at` DATETIME NOT NULL;
