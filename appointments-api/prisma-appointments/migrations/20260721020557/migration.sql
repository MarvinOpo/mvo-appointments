/*
  Warnings:

  - You are about to drop the column `dept_code` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `dept_name` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `patients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - Made the column `birth_date` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `civil_status` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `religion` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationality` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lot_no` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `barangay` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile_no` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `father_name` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mother_name` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `dept_name_UNIQUE` ON `departments`;

-- AlterTable
ALTER TABLE `departments` DROP COLUMN `dept_code`,
    DROP COLUMN `dept_name`,
    ADD COLUMN `code` VARCHAR(50) NULL,
    ADD COLUMN `name` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `patients` DROP COLUMN `gender`,
    ADD COLUMN `sex` CHAR(1) NOT NULL DEFAULT 'M',
    MODIFY `birth_date` DATE NOT NULL,
    MODIFY `civil_status` VARCHAR(20) NOT NULL,
    MODIFY `religion` VARCHAR(50) NOT NULL,
    MODIFY `nationality` VARCHAR(50) NOT NULL,
    MODIFY `occupation` VARCHAR(150) NOT NULL,
    MODIFY `lot_no` VARCHAR(100) NOT NULL,
    MODIFY `street` VARCHAR(100) NOT NULL,
    MODIFY `barangay` VARCHAR(100) NOT NULL,
    MODIFY `city` VARCHAR(100) NOT NULL,
    MODIFY `province` VARCHAR(100) NOT NULL,
    MODIFY `mobile_no` VARCHAR(20) NOT NULL,
    MODIFY `father_name` VARCHAR(150) NOT NULL,
    MODIFY `mother_name` VARCHAR(150) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dept_name_UNIQUE` ON `departments`(`name`);
