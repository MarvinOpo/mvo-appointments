/*
  Warnings:

  - You are about to alter the column `priority` on the `appointments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `appointments` MODIFY `priority` ENUM('EMPLOYEE', 'SENIOR', 'PWD', 'PREGNANT', 'REGULAR') NOT NULL DEFAULT 'REGULAR';
