-- CreateTable
CREATE TABLE "nutrition_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "target_calories" INTEGER,
    "actual_calories" INTEGER,
    "target_protein_g" DECIMAL(6,1),
    "actual_protein_g" DECIMAL(6,1),
    "target_carbs_g" DECIMAL(6,1),
    "actual_carbs_g" DECIMAL(6,1),
    "target_fat_g" DECIMAL(6,1),
    "actual_fat_g" DECIMAL(6,1),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "nutrition_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_logs_user_id_date_key" ON "nutrition_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "nutrition_logs_user_id_date_idx" ON "nutrition_logs"("user_id", "date");

-- AddForeignKey
ALTER TABLE "nutrition_logs" ADD CONSTRAINT "nutrition_logs_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
