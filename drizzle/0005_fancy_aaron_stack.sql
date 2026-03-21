CREATE TYPE "public"."station_type" AS ENUM('fuel', 'gas', 'ev');--> statement-breakpoint
ALTER TABLE "station" ADD COLUMN "type" "station_type" DEFAULT 'fuel' NOT NULL;