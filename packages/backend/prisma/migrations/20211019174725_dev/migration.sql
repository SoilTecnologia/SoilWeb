/*
  Warnings:

  - A unique constraint covering the columns `[pivot_id]` on the table `Intent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Intent_pivot_id_key` ON `Intent`(`pivot_id`);
