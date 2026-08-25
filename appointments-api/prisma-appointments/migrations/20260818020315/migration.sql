/*
  Warnings:

  - You are about to drop the column `ai_assisted` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `ai_assisted`,
    ADD COLUMN `ai_dept_matched` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ai_soap_assisted` BOOLEAN NOT NULL DEFAULT false;
