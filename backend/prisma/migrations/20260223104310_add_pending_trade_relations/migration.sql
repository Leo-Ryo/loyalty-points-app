-- AlterTable
ALTER TABLE "app_settings" ADD COLUMN     "tradeExpiryHours" INTEGER NOT NULL DEFAULT 24;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "inventoryId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
