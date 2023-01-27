import { FastifyInstance, FastifyRequest } from "fastify";

import { S3, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY as string,
    secretAccessKey: process.env.DO_SPACES_SECRET as string,
  },
});
export const imageRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallimages/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      try {
        const key = `assets/images/${req.params.project_id}/`;
        const data = await s3Client.send(
          new ListObjectsCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Delimiter: "/",
            Prefix: key,
          })
        );
        return data?.Contents || [];
      } catch (error) {
        console.log(error);
      }
    }
  );
  server.get(
    "/getallmapimages/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      try {
        const key = `assets/maps/${req.params.project_id}/`;
        const data = await s3Client.send(
          new ListObjectsCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Delimiter: "/",
            Prefix: key,
          })
        );
        return data?.Contents || [];
      } catch (error) {
        return [];
      }
      return [];
    }
  );

  // server.get(
  //   "/getallsettingsimages/:project_id",
  //   async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
  //     const imagesDir = `./assets/images/${req.params.project_id}`;
  //     // check if folder already exists
  //     if (!existsSync(imagesDir)) {
  //       mkdirSync(imagesDir, {
  //         recursive: true,
  //       }); // creating folder
  //     }
  //     const mapsDir = `./assets/maps/${req.params.project_id}`;
  //     // check if folder already exists
  //     if (!existsSync(mapsDir)) {
  //       mkdirSync(mapsDir, {
  //         recursive: true,
  //       }); // creating folder
  //     }
  //     const images = readdirSync(`./assets/images/${req.params.project_id}`);
  //     const maps = readdirSync(`./assets/maps/${req.params.project_id}`);
  //     return [
  //       ...images.map((image) => ({ image, type: "image" })),
  //       ...maps.map((map) => ({ image: map, type: "map" })),
  //     ];
  //   }
  // );
  server.post(
    "/uploadimage/:type/:project_id",
    async (
      req: FastifyRequest<{
        Params: { type: "images" | "maps"; project_id: string };
        Body: any[];
      }>
    ) => {
      try {
        const files = req.body;
        const { type, project_id } = req.params;

        Object.entries(files).forEach(async ([key, file]) => {
          const filePath = `assets/${type}/${project_id}/${key}`;
          const params = {
            Bucket: process.env.DO_SPACES_NAME as string,
            Key: filePath,
            Body: file.data,
            ACL: "public-read",
            Metadata: {
              "content-type": file?.mimetype,
            },
          };

          await s3Client.send(new PutObjectCommand(params));
          return true;
        });
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );

  done();
};
