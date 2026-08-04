-- AddForeignKey
ALTER TABLE `appointment_logs` ADD CONSTRAINT `appointment_logs_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
