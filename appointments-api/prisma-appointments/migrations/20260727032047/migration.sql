-- DropForeignKey
ALTER TABLE `appointment_logs` DROP FOREIGN KEY `appointment_logs_appointment_id_fkey`;

-- DropIndex
DROP INDEX `appointment_logs_appointment_id_fkey` ON `appointment_logs`;
