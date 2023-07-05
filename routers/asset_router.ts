import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import sharp from "sharp";

export const assetRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallimages/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const key = `assets/${req.params.project_id}/images/`;

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
