/*
  Warnings:

  - You are about to drop the column `can_complete_appointment` on the `access_rights` table. All the data in the column will be lost.
  - You are about to drop the column `can_forward_appointment` on the `access_rights` table. All the data in the column will be lost.
  - You are about to drop the column `can_view_appointments` on the `access_rights` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `access_rights` DROP COLUMN `can_complete_appointment`,
    DROP COLUMN `can_forward_appointment`,
    DROP COLUMN `can_view_appointments`,
    ADD COLUMN `can_complete_appt` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `can_forward_appt` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `can_manage_all_appts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `can_manage_dept_appts` BOOLEAN NOT NULL DEFAULT false;
