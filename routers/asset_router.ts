import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import path from "path";

import sharp from "sharp";
import { db } from "../utils";
import { images } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const assetRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/:projectId",
    async (
      req: FastifyRequest<{ Params: { projectId: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const imagesKey = `assets/${req.params.projectId}/images/`;
        const mapsKey = `assets/${req.params.projectId}/maps/`;

        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.get(
    "/:type/:projectId",
    async (
      req: FastifyRequest<{ Params: { type: string; projectId: string } }>,
      rep: FastifyReply
    ) => {
      const { projectId, type } = req.params;
      try {
        const key = `assets/${projectId}/${type}/`;

        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );

  server.post(
    "/upload/:projectId/:type",
    async (
      req: FastifyRequest<{
        Params: { type: "images" | "maps"; projectId: string };
        Body: any[];
      }>,
      rep: FastifyReply
    ) => {
      const files = req.body;
      const { type, projectId: projectId } = req.params;

      const fileNames: string[] = [];

      Object.entries(files).forEach(async ([key, file]) => {
        const filePath = `assets/${projectId}/${type}`;

        if (!existsSync(filePath)) {
          mkdirSync(filePath, { recursive: true });
        }
        sharp(file.data)
          .toFormat("webp")
          .toFile(
            `${filePath}/${key.substring(0, key.lastIndexOf(".")) + ".webp"}`,
            (err) => {
              if (err) {
                console.error(err);
                rep.send({ message: "File not saved.", ok: false });
              }
            }
          );
        fileNames.push(key);
      });
      await db.transaction(async (tx) => {
        await Promise.all(
          fileNames.map((name) =>
            tx
              .insert(images)
              .values({ title: name, projectsId: req.params.projectId })
          )
        );
      });
      rep.send({ message: "Files saved successfully.", ok: true });
    }
  );

  server.delete(
    "/delete/:type/:id",
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
          type: string;
        };
        Body: {
          data: {
            projectId: string;
          };
        };
      }>,
      rep: FastifyReply
    ) => {
      const { id, type } = req.params;
      const { projectId } = req.body.data;
      const imageData = await db
        .select({ title: images.title })
        .from(images)
        .where(eq(images.id, id));

      const filePath = `assets/${projectId}/${type}/${imageData[0].title}`;
      if (existsSync(filePath)) {
        unlinkSync(filePath);

        await db.delete(images).where(eq(images.id, id));
        rep.send({ message: "Image deleted successfully.", ok: true });
      }
    }
  );

  done();
};
