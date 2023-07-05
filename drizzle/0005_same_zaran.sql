ALTER TABLE "boards" RENAME TO "graphs";--> statement-breakpoint
ALTER TABLE "_boardsTotags" RENAME TO "_graphsTotags";--> statement-breakpoint
ALTER TABLE "roles" RENAME COLUMN "view_boards" TO "view_graphs";--> statement-breakpoint
ALTER TABLE "roles" RENAME COLUMN "edit_boards" TO "edit_graphs";--> statement-breakpoint
ALTER TABLE "edges" DROP CONSTRAINT "edges_parent_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_parent_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "graphs" DROP CONSTRAINT "boards_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "graphs" DROP CONSTRAINT "boards_parent_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "_graphsTotags" DROP CONSTRAINT "_boardsTotags_A_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "_graphsTotags" DROP CONSTRAINT "_boardsTotags_B_tags_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "_boardsTotags_AB_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "_boardsTotags_B_index";--> statement-breakpoint
ALTER TABLE "graphs" ALTER COLUMN "title" SET DEFAULT 'New Graph';--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_graphsTotags_AB_unique" ON "_graphsTotags" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_graphsTotags_B_index" ON "_graphsTotags" ("B");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "edges" ADD CONSTRAINT "edges_parent_id_graphs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "graphs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nodes" ADD CONSTRAINT "nodes_parent_id_graphs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "graphs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "graphs" ADD CONSTRAINT "graphs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "graphs" ADD CONSTRAINT "graphs_parent_id_graphs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "graphs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_graphsTotags" ADD CONSTRAINT "_graphsTotags_A_graphs_id_fk" FOREIGN KEY ("A") REFERENCES "graphs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_graphsTotags" ADD CONSTRAINT "_graphsTotags_B_tags_id_fk" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
