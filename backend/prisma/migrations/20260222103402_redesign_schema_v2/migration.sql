/*
  Warnings:

  - You are about to drop the column `firstName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `rewardId` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `rewards` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `rewards` table. All the data in the column will be lost.
  - You are about to drop the column `pointsCost` on the `rewards` table. All the data in the column will be lost.
  - You are about to drop the column `requiresStock` on the `rewards` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsRequired` to the `rewards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardName` to the `rewards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_rewardId_fkey";

-- DropIndex
DROP INDEX "inventory_rewardId_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventory" DROP COLUMN "quantity",
DROP COLUMN "rewardId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPromoted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "rewards" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "pointsCost",
DROP COLUMN "requiresStock",
ADD COLUMN     "pointsRequired" INTEGER NOT NULL,
ADD COLUMN     "rewardDescription" TEXT,
ADD COLUMN     "rewardName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "targetSection" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL,
    "navigationPosition" TEXT NOT NULL DEFAULT 'left',
    "adsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultWelcomePoints" INTEGER NOT NULL DEFAULT 0,
    "businessName" TEXT,
    "logoUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");
