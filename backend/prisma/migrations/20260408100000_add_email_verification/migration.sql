-- AlterTable
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "email_verify_token" VARCHAR(128);
ALTER TABLE "users" ADD COLUMN "email_verify_expires" TIMESTAMPTZ;
