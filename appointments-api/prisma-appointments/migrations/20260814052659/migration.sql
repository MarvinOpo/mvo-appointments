/*
  Warnings:

  - You are about to drop the column `holiday` on the `holidays` table. All the data in the column will be lost.
  - Added the required column `date` to the `holidays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `holidays` DROP COLUMN `holiday`,
    ADD COLUMN `date` DATE NOT NULL;
