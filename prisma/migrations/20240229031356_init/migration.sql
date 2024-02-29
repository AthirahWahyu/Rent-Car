/*
  Warnings:

  - The `tanggal` column on the `rent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `car` MODIFY `nopol` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `rent` DROP COLUMN `tanggal`,
    ADD COLUMN `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
