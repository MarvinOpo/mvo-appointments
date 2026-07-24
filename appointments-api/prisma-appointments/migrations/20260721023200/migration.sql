/*
  Warnings:

  - You are about to drop the column `etime` on the `department_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `stime` on the `department_schedule` table. All the data in the column will be lost.
  - You are about to alter the column `day` on the `department_schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Json`.
  - Added the required column `end` to the `department_schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `department_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `department_schedule` DROP COLUMN `etime`,
    DROP COLUMN `stime`,
    ADD COLUMN `end` TIME(0) NOT NULL,
    ADD COLUMN `start` TIME(0) NOT NULL,
    MODIFY `day` JSON NOT NULL;
