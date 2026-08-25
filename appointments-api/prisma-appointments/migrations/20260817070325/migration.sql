-- AlterTable
ALTER TABLE `appointments` MODIFY `subjective` TEXT NULL,
    MODIFY `objective` TEXT NULL,
    MODIFY `assessment` TEXT NULL,
    MODIFY `plan` TEXT NULL;

-- AddForeignKey
ALTER TABLE `user_access` ADD CONSTRAINT `user_access_access_right_fkey` FOREIGN KEY (`access_right`) REFERENCES `access_rights`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
