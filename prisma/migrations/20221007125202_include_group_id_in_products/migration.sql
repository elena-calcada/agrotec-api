/*
  Warnings:

  - Added the required column `group_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "group_id" TEXT NOT NULL;
