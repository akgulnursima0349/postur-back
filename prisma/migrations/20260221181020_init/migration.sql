-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NOT_SPECIFIED');

-- CreateEnum
CREATE TYPE "DeviceMode" AS ENUM ('CASUAL', 'TRAINING');

-- CreateEnum
CREATE TYPE "VibrationSpeed" AS ENUM ('FAST_SHORT', 'MEDIUM_FAST', 'MEDIUM_SLOW', 'SLOW_LONG');

-- CreateEnum
CREATE TYPE "BatteryState" AS ENUM ('EMPTY', 'CRITICAL', 'IDLE', 'CHARGING', 'FULL');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('UNSYNCED', 'SYNCING', 'SYNCED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "dateOfBirth" TIMESTAMP(3),
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nickname" TEXT,
    "serialNumber" TEXT NOT NULL,
    "firmwareVersion" TEXT,
    "deviceMode" "DeviceMode" NOT NULL DEFAULT 'CASUAL',
    "vibrationPower" INTEGER NOT NULL DEFAULT 2,
    "vibrationSpeed" "VibrationSpeed" NOT NULL DEFAULT 'MEDIUM_FAST',
    "alertDelaySeconds" INTEGER NOT NULL DEFAULT 5,
    "alertLevelDegrees" INTEGER NOT NULL DEFAULT 30,
    "triggerLimitSeconds" INTEGER NOT NULL DEFAULT 10,
    "batteryState" "BatteryState" NOT NULL DEFAULT 'IDLE',
    "batteryPercentage" INTEGER,
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'UNSYNCED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostureSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "uprightTimeMinutes" DOUBLE PRECISION,
    "totalTimeMinutes" DOUBLE PRECISION,
    "averageScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostureSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorData" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "axisX" DOUBLE PRECISION NOT NULL,
    "axisY" DOUBLE PRECISION NOT NULL,
    "axisZ" DOUBLE PRECISION NOT NULL,
    "isUpright" BOOLEAN NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "uprightTimeMinutes" INTEGER NOT NULL DEFAULT 480,
    "deviceUsageMinutes" INTEGER NOT NULL DEFAULT 60,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "exerciseActualMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uprightActualMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deviceUsageActualMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DailyGoal_userId_date_key" ON "DailyGoal"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyProgress_userId_date_key" ON "DailyProgress"("userId", "date");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostureSession" ADD CONSTRAINT "PostureSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PostureSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGoal" ADD CONSTRAINT "DailyGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyProgress" ADD CONSTRAINT "DailyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachConversation" ADD CONSTRAINT "CoachConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachMessage" ADD CONSTRAINT "CoachMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "CoachConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
