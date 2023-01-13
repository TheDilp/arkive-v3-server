import cors from "@fastify/cors";
import fastifystatic from "@fastify/static";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import fileupload from "fastify-file-upload";
import path from "path";

import { boardRouter } from "./routers/BoardRouter";
import { documentRouter } from "./routers/DocumentRouter";
import { imageRouter } from "./routers/ImageRouter";
import { mapRouter } from "./routers/MapRouter";
import { projectRouter } from "./routers/ProjectRouter";
import { searchRouter } from "./routers/SearchRouter";
import { tagRouter } from "./routers/TagRouter";

export const prisma = new PrismaClient();

const server = fastify();
server.register(fastifystatic, {
  root: path.join(__dirname, "assets"),
});

server.register(fileupload);

server.register(cors, {
  origin: true,
});
server.register(projectRouter);
server.register(searchRouter);
server.register(tagRouter);
server.register(documentRouter);
server.register(mapRouter);
server.register(boardRouter);
server.register(imageRouter);
if (process.env.VITE_BE_PORT) {
  server.listen({ port: parseInt(process.env.VITE_BE_PORT, 10) as number }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
} else {
  console.log("NO VITE_BE_PORT");
}
