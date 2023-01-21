import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify, { FastifyRequest } from "fastify";

import * as admin from "firebase-admin";

import { boardRouter } from "./routers/BoardRouter";
import { documentRouter } from "./routers/DocumentRouter";
import { imageRouter } from "./routers/ImageRouter";
import { mapRouter } from "./routers/MapRouter";
import { otherRouter } from "./routers/OtherRouter";
import { projectRouter } from "./routers/ProjectRouter";
import { searchRouter } from "./routers/SearchRouter";
import { tagRouter } from "./routers/TagRouter";
import { userRouter } from "./routers/UserRouter";

declare module "fastify" {
  interface FastifyRequest {
    user_id: string;
  }
}

export const prisma = new PrismaClient();

const firebase = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PKEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENTEMAIL,
  }),
});

const server = fastify();
server.decorateRequest("user_id", null);

server.register(cors, {
  origin: "*",
});
server.register(otherRouter);

server.register((instance, _, done) => {
  instance.addHook("preParsing", async (request) => {
    const token = await firebase
      .auth()
      .verifyIdToken(request.headers.authorization?.split(" ")[1] as string);

    request.user_id = token.uid;
  });

  instance.register(userRouter);
  instance.register(projectRouter);
  instance.register(searchRouter);
  instance.register(tagRouter);
  instance.register(documentRouter);
  instance.register(mapRouter);
  instance.register(boardRouter);
  instance.register(imageRouter);

  done();
});

if (process.env.VITE_BE_PORT) {
  server.listen(
    { port: parseInt(process.env.VITE_BE_PORT, 10) as number, host: "0.0.0.0" },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    }
  );
} else {
  console.log("NO VITE_BE_PORT");
}
