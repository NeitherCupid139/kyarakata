CREATE TABLE "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"novel_id" integer,
	"title" varchar(255),
	"content" text,
	"chapter_number" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_event_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer,
	"event_id" integer,
	"role_in_event" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"character1_id" integer,
	"character2_id" integer,
	"relationship_type" varchar(50),
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"gender" varchar(20),
	"age" integer,
	"background" text,
	"personality" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "novels" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"author" varchar(100),
	"description" text,
	"cover_image_url" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_character_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"character_id" integer,
	"role_in_world" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100),
	"email" varchar(100),
	"password_hash" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_event_relations" ADD CONSTRAINT "character_event_relations_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_event_relations" ADD CONSTRAINT "character_event_relations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_character1_id_characters_id_fk" FOREIGN KEY ("character1_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_character2_id_characters_id_fk" FOREIGN KEY ("character2_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_character_relations" ADD CONSTRAINT "user_character_relations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_character_relations" ADD CONSTRAINT "user_character_relations_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;