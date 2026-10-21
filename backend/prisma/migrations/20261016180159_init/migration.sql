/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `refresh_session` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `refresh_session` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `refresh_session` table. All the data in the column will be lost.
  - You are about to drop the column `revokedAt` on the `refresh_session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `refresh_session` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `refresh_session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "refresh_session_expiresAt_idx";

-- AlterTable
ALTER TABLE "refresh_session" DROP COLUMN "expiresAt",
DROP COLUMN "ipAddress",
DROP COLUMN "lastUsedAt",
DROP COLUMN "revokedAt",
DROP COLUMN "userAgent",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "last_used_at" TIMESTAMP(3),
ADD COLUMN     "revoked_at" TIMESTAMP(3),
ADD COLUMN     "user_agent" TEXT;

-- CreateIndex
CREATE INDEX "refresh_session_expires_at_idx" ON "refresh_session"("expires_at");
