/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Room` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Room_code_key` ON `Room`;

-- AlterTable
ALTER TABLE `Room` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`code`);
