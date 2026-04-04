CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'suspended');--> statement-breakpoint
ALTER TABLE "station" ADD COLUMN "status" "status" DEFAULT 'pending' NOT NULL;