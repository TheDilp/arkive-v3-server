import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

import fileUpload from "fastify-file-upload";
import * as admin from "firebase-admin";
import set from "lodash.set";
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
const mainIncrementItems = [
  "documents",
  "maps",
  "boards",
  "calendars",
  "dictionaries",
  "screens",
  "randomtables",
];

const firebase = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PKEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENTEMAIL,
  }),
});

const server = fastify();
prisma.$use(async (params, next) => {
  try {
    if (params.action === "create" && params?.model) {
      const parentId = params.args.data.parentId;
      if (parentId) {
        let count = 0;

        // @ts-ignore
        count = await prisma[params.model].count({
          where: {
            parentId,
          },
        });
        const newSort = count + 1;
        const tempParams = { ...params };

        set(tempParams, "args.data.sort", newSort);
        const result = await next(tempParams);
        // See results here
        return result;
      }
    }
  } catch (error) {}

  const result = await next(params);
  // See results here
  return result;
});
prisma.$use(async (params, next) => {
  if (
    params.action === "create" &&
    params?.model &&
    mainIncrementItems.includes(params.model)
  ) {
    try {
      // @ts-ignore
      const count = await prisma[params.model].count({
        where: {
          project_id: params.args.data.project_id,
        },
      });
      const newSort = count + 1;
      const tempParams = { ...params };

      set(tempParams, "args.data.sort", newSort);
      const result = await next(tempParams);
      // See results here
      return result;
    } catch (error) {
      const result = await next(params);
      // See results here
      return result;
    }
  }
  const result = await next(params);
  // See results here
  return result;
});

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
