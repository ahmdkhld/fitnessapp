-- AlterTable: add optional nutritional fields to meal_ingredients
-- These columns already exist in the Prisma schema from a prior commit;
-- this migration is the corresponding SQL for databases that were created
-- before the columns were added to the schema.

ALTER TABLE "meal_ingredients" ADD COLUMN IF NOT EXISTS "calories" INTEGER;
ALTER TABLE "meal_ingredients" ADD COLUMN IF NOT EXISTS "protein_g" DECIMAL(6,1);
ALTER TABLE "meal_ingredients" ADD COLUMN IF NOT EXISTS "carbs_g" DECIMAL(6,1);
ALTER TABLE "meal_ingredients" ADD COLUMN IF NOT EXISTS "fat_g" DECIMAL(6,1);
