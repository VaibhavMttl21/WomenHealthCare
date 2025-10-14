/*
  Warnings:

  - You are about to drop the column `dietaryPreferences` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `foodAllergies` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCuisine` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "isSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "dietaryPreferences",
DROP COLUMN "foodAllergies",
DROP COLUMN "preferredCuisine";

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");

-- CreateIndex
CREATE INDEX "device_tokens_userId_idx" ON "device_tokens"("userId");
