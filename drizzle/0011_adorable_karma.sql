CREATE TYPE "public"."support_status" AS ENUM('pending', 'open', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."support_topic_value" AS ENUM('delete-account', 'remove-data', 'privacy-concern', 'account-issue', 'app-feedback', 'other');--> statement-breakpoint
CREATE TABLE "support_topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" "support_topic_value" DEFAULT 'other' NOT NULL,
	"icon" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"app_id" varchar(10) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"topic_id" uuid NOT NULL,
	"message" text NOT NULL,
	"status" "support_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "support" ADD CONSTRAINT "support_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support" ADD CONSTRAINT "support_topic_id_support_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."support_topic"("id") ON DELETE cascade ON UPDATE no action;