CREATE TYPE "public"."item_type" AS ENUM('fuel', 'gas', 'ev');--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "item_type" "item_type" NOT NULL;