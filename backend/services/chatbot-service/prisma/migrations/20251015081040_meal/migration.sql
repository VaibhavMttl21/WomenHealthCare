-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateTable
CREATE TABLE "meal_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Daily Meal Plan',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_suggestions" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "content" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meal_plans_userId_idx" ON "meal_plans"("userId");

-- CreateIndex
CREATE INDEX "meal_plans_date_idx" ON "meal_plans"("date");

-- CreateIndex
CREATE INDEX "meal_suggestions_mealPlanId_idx" ON "meal_suggestions"("mealPlanId");

-- CreateIndex
CREATE INDEX "meal_suggestions_type_idx" ON "meal_suggestions"("type");

-- AddForeignKey
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_suggestions" ADD CONSTRAINT "meal_suggestions_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
