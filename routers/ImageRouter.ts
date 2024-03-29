import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

import sharp from "sharp";
import { s3Client } from "../client";

export const imageRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallimages/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const key = `assets/${req.params.project_id}/images/`;
        const data = await s3Client.send(
          new ListObjectsCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Delimiter: "/",
            Prefix: key,
          })
        );
        rep.send(data?.Contents || []);
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
    "/getallmapimages/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const key = `assets/${req.params.project_id}/maps/`;
        const data = await s3Client.send(
          new ListObjectsCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Delimiter: "/",
            Prefix: key,
          })
        );
        rep.send(data?.Contents || []);
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
    "/getallsettingsimages/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const imagesKey = `assets/${req.params.project_id}/images/`;
        const mapsKey = `assets/${req.params.project_id}/maps/`;

        const images = await s3Client.send(
          new ListObjectsCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Delimiter: "/",
            Prefix: imagesKey,
          })
        );
        const maps = await s3Client.send(
          new ListObjectsCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Delimiter: "/",
            Prefix: mapsKey,
          })
        );
        const data = [...(images?.Contents || []), ...(maps?.Contents || [])];
        rep.send(data || []);
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
    "/uploadimage/:type/:project_id",
    async (
      req: FastifyRequest<{
        Params: { type: "images" | "maps"; project_id: string };
        Body: any[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const files = req.body;
        const { type, project_id } = req.params;

        Object.entries(files).forEach(async ([key, file]) => {
          const filePath = `assets/${project_id}/${type}/${key}`;
          try {
            const webpImage = await sharp(file.data)
              .toFormat("webp")
              .toBuffer();

            const params = {
              Bucket: process.env.DO_SPACES_NAME as string,
              Key: filePath.substring(0, filePath.lastIndexOf(".")) + ".webp",

              Body: webpImage,
              ACL: "public-read",
              ContentType: "image/webp",
            };

            await s3Client.send(new PutObjectCommand(params));
            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );

  server.delete(
    "/deleteimage",
    async (
      req: FastifyRequest<{
        Body: {
          image: string;
          project_id: string;
          type: "images" | "maps";
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Key: `assets/${data.project_id}/${data.type}/${data.image}`,
          })
        );
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );

  done();
};
