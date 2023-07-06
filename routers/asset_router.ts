import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync, mkdirSync, readFileSync, unlinkSync } from "fs";
import path from "path";

import sharp from "sharp";
import { db } from "../utils";
import { images } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const assetRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region read_router
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
    "/:projectId/:type",
    async (
      req: FastifyRequest<{ Params: { type: string; projectId: string } }>,
      rep: FastifyReply
    ) => {
      const { projectId, type } = req.params;
      const data = await db
        .select({ id: images.id, title: images.title })
        .from(images);
      if (data) {
        rep.send({ data, message: "Success", ok: true });
      }
    }
  );

  server.get(
    "/:projectId/:type/:title",
    async (
      req: FastifyRequest<{
        Params: { projectId: string; type: "images" | "maps"; title: string };
      }>,
      rep
    ) => {
      const { projectId, type, title } = req.params;
      const filePath = `./assets/${projectId}/${type}/${title}`;
      if (!existsSync(filePath)) {
        rep.code(404).send({
          message:
            "There are no assets of the requested type for this project.",
          ok: false,
        });
      }
      const image = readFileSync(filePath);
      rep.type("image/webp");
      rep.headers({
        "Cache-Control": "max-age=3600",
      });
      rep.send(image);
    }
  );

  // #endregion read_router

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
        const newName = key.substring(0, key.lastIndexOf(".")) + ".webp";
        sharp(file.data)
          .toFormat("webp")
          .toFile(`${filePath}/${newName}`, (err) => {
            if (err) {
              console.error(err);
              rep.send({ message: "File not saved.", ok: false });
            }
          });
        if (!existsSync(`${filePath}/${newName}`)) fileNames.push(newName);
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
