import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

import fileUpload from "fastify-file-upload";
import * as admin from "firebase-admin";
import { boardRouter } from "./routers/BoardRouter";
import { calendarRouter } from "./routers/CalendarRouter";
import { dictionaryRouter } from "./routers/DictionaryRouter";
import { documentRouter } from "./routers/DocumentRouter";
import { imageRouter } from "./routers/ImageRouter";
import { mapRouter } from "./routers/MapRouter";
import { otherRouter } from "./routers/OtherRouter";
import { projectRouter } from "./routers/ProjectRouter";
import { publicRouter } from "./routers/PublicRouter";
import { randomTableRouter } from "./routers/RandomTableRouter";
import { screenRouter } from "./routers/ScreenRouter";
import { searchRouter } from "./routers/SearchRouter";
import { tagRouter } from "./routers/TagRouter";
import { userRouter } from "./routers/UserRouter";
declare module "fastify" {
  interface FastifyRequest {
    auth_id: string;
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
server.register(fileUpload);

server.register(cors, {
  origin: "*",
});
server.register(otherRouter);

server.register((instance, _, done) => {
  instance.addHook("preParsing", async (request) => {
    const token = await firebase
      .auth()
      .verifyIdToken(request.headers.authorization?.split(" ")[1] as string);

    request.auth_id = token.uid;
  });

  instance.register(userRouter);
  instance.register(projectRouter);
  instance.register(searchRouter);
  instance.register(tagRouter);
  instance.register(documentRouter);
  instance.register(mapRouter);
  instance.register(boardRouter);
  instance.register(screenRouter);
  instance.register(dictionaryRouter);
  instance.register(calendarRouter);
  instance.register(randomTableRouter);
  instance.register(imageRouter);

  done();
});

server.register(publicRouter);
if (process.env.VITE_BE_PORT) {
  server.listen(
    { port: parseInt(process.env.VITE_BE_PORT, 10) as number, host: "0.0.0.0" },
    async (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
      console.log("===============================");
    }
  );
} else {
  console.log("NO VITE_BE_PORT");
}
