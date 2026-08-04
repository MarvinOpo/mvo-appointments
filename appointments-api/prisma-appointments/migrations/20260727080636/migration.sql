/*
  Warnings:

  - You are about to drop the column `can_forward_appt` on the `access_rights` table. All the data in the column will be lost.
  - You are about to drop the column `can_manage_all_appts` on the `access_rights` table. All the data in the column will be lost.
  - You are about to drop the column `can_manage_dept_appts` on the `access_rights` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `access_rights` DROP COLUMN `can_forward_appt`,
    DROP COLUMN `can_manage_all_appts`,
    DROP COLUMN `can_manage_dept_appts`,
    ADD COLUMN `can_manage_appts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `can_view_all_appts` BOOLEAN NOT NULL DEFAULT false;
