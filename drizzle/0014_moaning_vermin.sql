CREATE TYPE "public"."level" AS ENUM('pending', 'initialized', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "station" ADD COLUMN "level" "level" DEFAULT 'pending' NOT NULL;