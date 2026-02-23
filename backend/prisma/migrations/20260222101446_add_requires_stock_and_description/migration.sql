-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_rewardId_fkey";

-- AlterTable
ALTER TABLE "rewards" ADD COLUMN     "requiresStock" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "description" TEXT,
ALTER COLUMN "rewardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "rewards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
