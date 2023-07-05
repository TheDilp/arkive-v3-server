CREATE TABLE IF NOT EXISTS "alter_names" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'New Document' NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text DEFAULT 'New Board' NOT NULL,
	"isFolder" boolean,
	"isPublic" boolean,
	"sort" integer NOT NULL,
	"icon" text,
	"defaultNodeShape" text DEFAULT 'rectangle' NOT NULL,
	"defaultNodeColor" text DEFAULT '#595959' NOT NULL,
	"defaultEdgeColor" text DEFAULT '#595959' NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_boardsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendars" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"icon" text,
	"isFolder" boolean,
	"isPublic" boolean,
	"offset" integer NOT NULL,
	"hours" integer,
	"minutes" integer,
	"days" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_calendarsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_calendarsTotimelines" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sort" integer NOT NULL,
	"documentsId" uuid NOT NULL,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_cardsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "character_fields" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"field_type" text NOT NULL,
	"options" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "character_fields_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_character_fields_templatesTocharacters" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_character_fieldsTocharacter_fields_templates" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "character_to_character_field" (
	"id" uuid PRIMARY KEY NOT NULL,
	"characters_id" uuid NOT NULL,
	"character_fields_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "characters" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text,
	"nickname" text,
	"age" integer,
	"images_id" uuid,
	"project_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dictionaries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"project_id" uuid NOT NULL,
	"icon" text,
	"isFolder" boolean,
	"isPublic" boolean,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_dictionariesTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text DEFAULT 'New Document' NOT NULL,
	"content" jsonb,
	"icon" text,
	"isFolder" boolean,
	"isPublic" boolean,
	"isTemplate" boolean,
	"properties" jsonb,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"images_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_documentsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "edges" (
	"id" uuid PRIMARY KEY NOT NULL,
	"label" text,
	"curveStyle" text,
	"lineStyle" text,
	"lineColor" text,
	"lineFill" text,
	"lineOpacity" double precision,
	"width" integer,
	"controlPointDistances" integer,
	"controlPointWeights" double precision,
	"taxiDirection" text,
	"taxiTurn" integer,
	"arrowScale" integer,
	"targetArrowShape" text,
	"targetArrowFill" text,
	"targetArrowColor" text,
	"sourceArrowShape" text,
	"sourceArrowFill" text,
	"sourceArrowColor" text,
	"midTargetArrowShape" text,
	"midTargetArrowFill" text,
	"midTargetArrowColor" text,
	"midSourceArrowShape" text,
	"midSourceArrowFill" text,
	"midSourceArrowColor" text,
	"fontSize" integer,
	"fontColor" text,
	"fontFamily" text,
	"zIndex" integer,
	"source_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"parent_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_edgesTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"isPublic" boolean NOT NULL,
	"backgroundColor" text,
	"textColor" text,
	"year" integer NOT NULL,
	"day" integer NOT NULL,
	"hours" integer,
	"minutes" integer,
	"calendarsId" uuid,
	"documentsId" uuid,
	"monthsId" uuid NOT NULL,
	"images_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_eventsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'New image' NOT NULL,
	"link" text NOT NULL,
	"projectImageId" uuid NOT NULL,
	"projectsId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "map_layers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'New Layer' NOT NULL,
	"image" text,
	"parent_id" uuid NOT NULL,
	"isPublic" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "map_pins" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text,
	"parent_id" uuid NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"color" text DEFAULT '#ffffff' NOT NULL,
	"borderColor" text DEFAULT '#ffffff' NOT NULL,
	"backgroundColor" text DEFAULT '#000000' NOT NULL,
	"icon" text,
	"showBackground" boolean DEFAULT true NOT NULL,
	"showBorder" boolean DEFAULT true NOT NULL,
	"isPublic" boolean,
	"map_link" uuid,
	"doc_id" uuid,
	"images_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_map_pinsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text DEFAULT 'New Map' NOT NULL,
	"isFolder" boolean NOT NULL,
	"isPublic" boolean NOT NULL,
	"clusterPins" boolean NOT NULL,
	"icon" text,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"images_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_mapsTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "months" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"days" integer NOT NULL,
	"sort" integer NOT NULL,
	"parent_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nodes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"label" text,
	"type" text,
	"width" integer,
	"height" integer,
	"x" double precision,
	"y" double precision,
	"fontSize" integer,
	"fontColor" text,
	"fontFamily" text,
	"textVAlign" text,
	"textHAlign" text,
	"backgroundColor" text,
	"backgroundOpacity" double precision,
	"locked" boolean,
	"isTemplate" boolean,
	"zIndex" integer,
	"doc_id" uuid,
	"parent_id" uuid NOT NULL,
	"images_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_nodesTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid,
	"permission" text NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_project_members" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text DEFAULT 'New Project' NOT NULL,
	"owner_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "random_table_options" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"parent_id" uuid NOT NULL,
	"icon" text,
	"iconColor" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "random_tables" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"isShared" boolean NOT NULL,
	"icon" text,
	"isFolder" boolean,
	"isPublic" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"project_id" uuid NOT NULL,
	"view_documents" boolean NOT NULL,
	"edit_documents" boolean NOT NULL,
	"view_maps" boolean NOT NULL,
	"edit_maps" boolean NOT NULL,
	"view_boards" boolean NOT NULL,
	"edit_boards" boolean NOT NULL,
	"view_calendars" boolean NOT NULL,
	"edit_calendars" boolean NOT NULL,
	"view_timelines" boolean NOT NULL,
	"edit_timelines" boolean NOT NULL,
	"view_screens" boolean NOT NULL,
	"edit_screens" boolean NOT NULL,
	"view_dictionaries" boolean NOT NULL,
	"edit_dictionaries" boolean NOT NULL,
	"view_random_tables" boolean NOT NULL,
	"edit_random_tables" boolean NOT NULL,
	"edit_tags" boolean NOT NULL,
	"edit_alter_names" boolean NOT NULL,
	"upload_assets" boolean NOT NULL,
	"delete_assets" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_rolesTousers" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "screens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text DEFAULT 'New Screen' NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"icon" text,
	"isFolder" boolean,
	"isPublic" boolean,
	"sectionSize" text DEFAULT 'md' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_screensTotags" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"sort" integer NOT NULL,
	"cardSize" text DEFAULT 'md' NOT NULL,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "swatches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"color" text DEFAULT '#595959' NOT NULL,
	"project_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"project_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timelines" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"icon" text,
	"isFolder" boolean,
	"isPublic" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"auth_id" text NOT NULL,
	"nickname" text NOT NULL,
	"email" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "words" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"translation" text NOT NULL,
	"parent_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "alter_names_title_parent_id_key" ON "alter_names" ("title","parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_boardsTotags_AB_unique" ON "_boardsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_boardsTotags_B_index" ON "_boardsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_calendarsTotags_AB_unique" ON "_calendarsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_calendarsTotags_B_index" ON "_calendarsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_calendarsTotimelines_AB_unique" ON "_calendarsTotimelines" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_calendarsTotimelines_B_index" ON "_calendarsTotimelines" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cards_parent_id_documentsId_key" ON "cards" ("documentsId","parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_cardsTotags_AB_unique" ON "_cardsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_cardsTotags_B_index" ON "_cardsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_character_fields_templatesTocharacters_AB_unique" ON "_character_fields_templatesTocharacters" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_character_fields_templatesTocharacters_B_index" ON "_character_fields_templatesTocharacters" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_character_fieldsTocharacter_fields_templates_AB_unique" ON "_character_fieldsTocharacter_fields_templates" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_character_fieldsTocharacter_fields_templates_B_index" ON "_character_fieldsTocharacter_fields_templates" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "dictionaries_project_id_title_key" ON "dictionaries" ("title","project_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_dictionariesTotags_AB_unique" ON "_dictionariesTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_dictionariesTotags_B_index" ON "_dictionariesTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_documentsTotags_AB_unique" ON "_documentsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_documentsTotags_B_index" ON "_documentsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "edges_source_id_target_id_key" ON "edges" ("source_id","target_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_edgesTotags_AB_unique" ON "_edgesTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_edgesTotags_B_index" ON "_edgesTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_eventsTotags_AB_unique" ON "_eventsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_eventsTotags_B_index" ON "_eventsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "images_projectImageId_key" ON "images" ("projectImageId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_map_pinsTotags_AB_unique" ON "_map_pinsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_map_pinsTotags_B_index" ON "_map_pinsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_mapsTotags_AB_unique" ON "_mapsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_mapsTotags_B_index" ON "_mapsTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_nodesTotags_AB_unique" ON "_nodesTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_nodesTotags_B_index" ON "_nodesTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_project_members_AB_unique" ON "_project_members" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_project_members_B_index" ON "_project_members" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roles_title_project_id_key" ON "roles" ("title","project_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_rolesTousers_AB_unique" ON "_rolesTousers" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_rolesTousers_B_index" ON "_rolesTousers" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_screensTotags_AB_unique" ON "_screensTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_screensTotags_B_index" ON "_screensTotags" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "swatches_color_project_id_key" ON "swatches" ("color","project_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tags_title_project_id_key" ON "tags" ("title","project_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_auth_id_key" ON "users" ("auth_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhooks_id_user_id_key" ON "webhooks" ("id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "words_title_translation_parent_id_key" ON "words" ("title","translation","parent_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alter_names" ADD CONSTRAINT "alter_names_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alter_names" ADD CONSTRAINT "alter_names_parent_id_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "documents"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boards" ADD CONSTRAINT "boards_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boards" ADD CONSTRAINT "boards_parent_id_boards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_boardsTotags" ADD CONSTRAINT "_boardsTotags_A_boards_id_fk" FOREIGN KEY ("A") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_boardsTotags" ADD CONSTRAINT "_boardsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendars" ADD CONSTRAINT "calendars_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendars" ADD CONSTRAINT "calendars_parent_id_calendars_id_fk" FOREIGN KEY ("parent_id") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_calendarsTotags" ADD CONSTRAINT "_calendarsTotags_A_calendars_id_fk" FOREIGN KEY ("A") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_calendarsTotags" ADD CONSTRAINT "_calendarsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_calendarsTotimelines" ADD CONSTRAINT "_calendarsTotimelines_A_calendars_id_fk" FOREIGN KEY ("A") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_calendarsTotimelines" ADD CONSTRAINT "_calendarsTotimelines_B_timelines_id_fk" FOREIGN KEY ("B") REFERENCES "timelines"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_documentsId_documents_id_fk" FOREIGN KEY ("documentsId") REFERENCES "documents"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_parent_id_sections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "sections"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_cardsTotags" ADD CONSTRAINT "_cardsTotags_A_cards_id_fk" FOREIGN KEY ("A") REFERENCES "cards"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_cardsTotags" ADD CONSTRAINT "_cardsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_character_fields_templatesTocharacters" ADD CONSTRAINT "_character_fields_templatesTocharacters_A_character_fields_templates_id_fk" FOREIGN KEY ("A") REFERENCES "character_fields_templates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_character_fields_templatesTocharacters" ADD CONSTRAINT "_character_fields_templatesTocharacters_B_characters_id_fk" FOREIGN KEY ("B") REFERENCES "characters"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_character_fieldsTocharacter_fields_templates" ADD CONSTRAINT "_character_fieldsTocharacter_fields_templates_A_character_fields_id_fk" FOREIGN KEY ("A") REFERENCES "character_fields"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_character_fieldsTocharacter_fields_templates" ADD CONSTRAINT "_character_fieldsTocharacter_fields_templates_B_character_fields_templates_id_fk" FOREIGN KEY ("B") REFERENCES "character_fields_templates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "character_to_character_field" ADD CONSTRAINT "character_to_character_field_characters_id_characters_id_fk" FOREIGN KEY ("characters_id") REFERENCES "characters"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "character_to_character_field" ADD CONSTRAINT "character_to_character_field_character_fields_id_character_fields_id_fk" FOREIGN KEY ("character_fields_id") REFERENCES "character_fields"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_images_id_images_id_fk" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_parent_id_dictionaries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "dictionaries"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_dictionariesTotags" ADD CONSTRAINT "_dictionariesTotags_A_dictionaries_id_fk" FOREIGN KEY ("A") REFERENCES "dictionaries"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_dictionariesTotags" ADD CONSTRAINT "_dictionariesTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_images_id_images_id_fk" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_parent_id_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "documents"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_documentsTotags" ADD CONSTRAINT "_documentsTotags_A_documents_id_fk" FOREIGN KEY ("A") REFERENCES "documents"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_documentsTotags" ADD CONSTRAINT "_documentsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "edges" ADD CONSTRAINT "edges_source_id_nodes_id_fk" FOREIGN KEY ("source_id") REFERENCES "nodes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "edges" ADD CONSTRAINT "edges_target_id_nodes_id_fk" FOREIGN KEY ("target_id") REFERENCES "nodes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "edges" ADD CONSTRAINT "edges_parent_id_boards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_edgesTotags" ADD CONSTRAINT "_edgesTotags_A_edges_id_fk" FOREIGN KEY ("A") REFERENCES "edges"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_edgesTotags" ADD CONSTRAINT "_edgesTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_calendarsId_calendars_id_fk" FOREIGN KEY ("calendarsId") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_documentsId_documents_id_fk" FOREIGN KEY ("documentsId") REFERENCES "documents"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_monthsId_months_id_fk" FOREIGN KEY ("monthsId") REFERENCES "months"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_images_id_images_id_fk" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_eventsTotags" ADD CONSTRAINT "_eventsTotags_A_events_id_fk" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_eventsTotags" ADD CONSTRAINT "_eventsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_projectImageId_projects_id_fk" FOREIGN KEY ("projectImageId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_projectsId_projects_id_fk" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_layers" ADD CONSTRAINT "map_layers_parent_id_maps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "maps"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_pins" ADD CONSTRAINT "map_pins_parent_id_maps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "maps"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_pins" ADD CONSTRAINT "map_pins_images_id_images_id_fk" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_map_pinsTotags" ADD CONSTRAINT "_map_pinsTotags_A_map_pins_id_fk" FOREIGN KEY ("A") REFERENCES "map_pins"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_map_pinsTotags" ADD CONSTRAINT "_map_pinsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_images_id_images_id_fk" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_parent_id_maps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "maps"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_mapsTotags" ADD CONSTRAINT "_mapsTotags_A_maps_id_fk" FOREIGN KEY ("A") REFERENCES "maps"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_mapsTotags" ADD CONSTRAINT "_mapsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "months" ADD CONSTRAINT "months_parent_id_calendars_id_fk" FOREIGN KEY ("parent_id") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nodes" ADD CONSTRAINT "nodes_doc_id_documents_id_fk" FOREIGN KEY ("doc_id") REFERENCES "documents"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nodes" ADD CONSTRAINT "nodes_parent_id_boards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nodes" ADD CONSTRAINT "nodes_images_id_images_id_fk" FOREIGN KEY ("images_id") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_nodesTotags" ADD CONSTRAINT "_nodesTotags_A_nodes_id_fk" FOREIGN KEY ("A") REFERENCES "nodes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_nodesTotags" ADD CONSTRAINT "_nodesTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_project_members" ADD CONSTRAINT "_project_members_A_projects_id_fk" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_project_members" ADD CONSTRAINT "_project_members_B_users_id_fk" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "random_table_options" ADD CONSTRAINT "random_table_options_parent_id_random_tables_id_fk" FOREIGN KEY ("parent_id") REFERENCES "random_tables"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "random_tables" ADD CONSTRAINT "random_tables_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "random_tables" ADD CONSTRAINT "random_tables_parent_id_random_tables_id_fk" FOREIGN KEY ("parent_id") REFERENCES "random_tables"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_rolesTousers" ADD CONSTRAINT "_rolesTousers_A_roles_id_fk" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_rolesTousers" ADD CONSTRAINT "_rolesTousers_B_users_id_fk" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screens" ADD CONSTRAINT "screens_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screens" ADD CONSTRAINT "screens_parent_id_screens_id_fk" FOREIGN KEY ("parent_id") REFERENCES "screens"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_screensTotags" ADD CONSTRAINT "_screensTotags_A_screens_id_fk" FOREIGN KEY ("A") REFERENCES "screens"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_screensTotags" ADD CONSTRAINT "_screensTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sections" ADD CONSTRAINT "sections_parent_id_screens_id_fk" FOREIGN KEY ("parent_id") REFERENCES "screens"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "swatches" ADD CONSTRAINT "swatches_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timelines" ADD CONSTRAINT "timelines_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timelines" ADD CONSTRAINT "timelines_parent_id_timelines_id_fk" FOREIGN KEY ("parent_id") REFERENCES "timelines"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "words" ADD CONSTRAINT "words_parent_id_dictionaries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "dictionaries"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
