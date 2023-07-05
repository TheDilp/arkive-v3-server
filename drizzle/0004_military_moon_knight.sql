ALTER TABLE "characters" RENAME COLUMN "images_id" TO "imageId";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "images_id" TO "imageId";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "images_id" TO "imageId";--> statement-breakpoint
ALTER TABLE "map_pins" RENAME COLUMN "images_id" TO "imageId";--> statement-breakpoint
ALTER TABLE "maps" RENAME COLUMN "images_id" TO "imageId";--> statement-breakpoint
ALTER TABLE "nodes" RENAME COLUMN "images_id" TO "imageId";--> statement-breakpoint
ALTER TABLE "characters" DROP CONSTRAINT "characters_images_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_images_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_images_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "map_pins" DROP CONSTRAINT "map_pins_images_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "maps" DROP CONSTRAINT "maps_images_id_images_id_fk";
--> statement-breakpoint
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_images_id_images_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_pins" ADD CONSTRAINT "map_pins_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nodes" ADD CONSTRAINT "nodes_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
