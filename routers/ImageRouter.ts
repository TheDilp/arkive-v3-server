import { FastifyInstance, FastifyRequest } from "fastify";
import { existsSync, mkdirSync, readdirSync, writeFile } from "fs";

export const imageRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallimages/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const dir = `./assets/images/${req.params.project_id}`;
    // check if folder already exists
    if (!existsSync(dir)) {
      mkdirSync(dir, {
        recursive: true,
      }); // creating folder
    }
    const files = readdirSync(`./assets/images/${req.params.project_id}`);
    if (files) return files;
    return [];
  });
  server.get("/getallmapimages/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    try {
      const dir = `./assets/maps/${req.params.project_id}`;
      // check if folder already exists
      if (!existsSync(dir)) {
        mkdirSync(dir, {
          recursive: true,
        }); // creating folder
      }
      const files = readdirSync(`./assets/maps/${req.params.project_id}`);
      if (files) return files;
    } catch (error) {
      return [];
    }
    return [];
  });
  server.get(
    "/getimage/:type/:project_id/:image_name",
    async (req: FastifyRequest<{ Params: { type: "images" | "maps"; project_id: string; image_name: string } }>, reply) => {
      const { type, project_id, image_name } = req.params;
      const dir = `./assets/images/${project_id}`;
      // check if folder already exists
      if (!existsSync(dir)) {
        mkdirSync(dir, {
          recursive: true,
        }); // creating folder
      }
      return reply
        .type("image/*")
        .headers({ "Cache-Control": "max-age=86400" })
        .sendFile(`${type}/${project_id}/${image_name}`);
    },
  );
  server.get("/getallsettingsimages/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const imagesDir = `./assets/images/${req.params.project_id}`;
    // check if folder already exists
    if (!existsSync(imagesDir)) {
      mkdirSync(imagesDir, {
        recursive: true,
      }); // creating folder
    }
    const mapsDir = `./assets/maps/${req.params.project_id}`;
    // check if folder already exists
    if (!existsSync(mapsDir)) {
      mkdirSync(mapsDir, {
        recursive: true,
      }); // creating folder
    }
    const images = readdirSync(`./assets/images/${req.params.project_id}`);
    const maps = readdirSync(`./assets/maps/${req.params.project_id}`);
    return [...images.map((image) => ({ image, type: "image" })), ...maps.map((map) => ({ image: map, type: "map" }))];
  });
  server.post(
    "/uploadimage/:type/:project_id",
    async (
      req: FastifyRequest<{
        Params: { type: "images" | "maps"; project_id: string };
        Body: any[];
      }>,
    ) => {
      try {
        const files = req.body;
        const { type, project_id } = req.params;
        const dir = `./assets/${type}/${project_id}`;

        // check if folder already exists
        if (!existsSync(dir)) {
          mkdirSync(dir, {
            recursive: true,
          }); // creating folder
        }
        Object.entries(files).forEach(([key, file]) => {
          writeFile(`./assets/${type}/${project_id}/${key}`, file.data, (err) => {
            if (err) console.log(err);
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
  );

  done();
};
