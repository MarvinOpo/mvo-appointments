/*
  Warnings:

  - You are about to drop the column `queue_session_id` on the `queue_session_stat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session_id,step]` on the table `queue_session_stat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session_id` to the `queue_session_stat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `queue_session_stat` DROP FOREIGN KEY `queue_session_stat_queue_session_id_fkey`;

-- DropIndex
DROP INDEX `queue_session_stat_queue_session_id_step_key` ON `queue_session_stat`;

-- AlterTable
ALTER TABLE `queue_session_stat` DROP COLUMN `queue_session_id`,
    ADD COLUMN `session_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `queue_session_stat_session_id_step_key` ON `queue_session_stat`(`session_id`, `step`);

-- AddForeignKey
ALTER TABLE `queue_session_stat` ADD CONSTRAINT `queue_session_stat_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `queue_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
