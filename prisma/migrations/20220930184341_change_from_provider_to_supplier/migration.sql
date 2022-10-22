/*
  Warnings:

  - You are about to drop the column `provider_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `providers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `supplier_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_provider_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "provider_id",
ADD COLUMN     "supplier_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "providers";

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
