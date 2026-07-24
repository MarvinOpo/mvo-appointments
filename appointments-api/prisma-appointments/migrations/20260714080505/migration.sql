/*
  Warnings:

  - You are about to drop the column `patient_ukey` on the `patients` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `patient_ukey` ON `patients`;

-- AlterTable
ALTER TABLE `patients` DROP COLUMN `patient_ukey`,
    ADD COLUMN `owner_user_id` INTEGER NULL,
    ADD COLUMN `relationship` VARCHAR(20) NULL;

-- CreateIndex
CREATE INDEX `patients_owner_user_id_idx` ON `patients`(`owner_user_id`);
