-- CreateTable
CREATE TABLE "broadcast_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userAvatar" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "broadcast_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "broadcast_messages_userId_idx" ON "broadcast_messages"("userId");

-- CreateIndex
CREATE INDEX "broadcast_messages_timestamp_idx" ON "broadcast_messages"("timestamp");
