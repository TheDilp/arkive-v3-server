import cors from "@fastify/cors";

import fastify from "fastify";

import { clerkPlugin } from "@clerk/fastify";
import fileUpload from "fastify-file-upload";
import set from "lodash.set";
import prisma from "./client";
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
import { timelineRouter } from "./routers/TimelineRouter";
import { userRouter } from "./routers/UserRouter";

declare module "fastify" {
  interface FastifyRequest {
    auth_id: string;
  }
}

const mainIncrementItems = [
  "documents",
  "maps",
  "boards",
  "calendars",
  "dictionaries",
  "screens",
  "randomtables",
];
const subIncrementItems = [
  "sections",
  "cards",
  "events",
  "months",
  "random_table_options",
];

const server = fastify();
server.register(clerkPlugin);
prisma.$use(async (params, next) => {
  try {
    if (params.action === "create" && params?.model) {
      if (subIncrementItems.includes(params.model)) {
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
        const result = await next(params);
        // See results here
        return result;
      }
      const result = await next(params);
      // See results here
      return result;
    }
  } catch (error) {
    const result = await next(params);
    // See results here
    return result;
  }

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
  origin: process.env.NODE_ENV === "production" ? "https://thearkive.app" : "*",
});
server.register(otherRouter);

server.register(userRouter);
server.register(projectRouter);
server.register(searchRouter);
server.register(tagRouter);
server.register(documentRouter);
server.register(mapRouter);
server.register(boardRouter);
server.register(calendarRouter);
server.register(timelineRouter);
server.register(screenRouter);
server.register(dictionaryRouter);
server.register(randomTableRouter);
server.register(imageRouter);

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
      console.log("==============================");
    }
  );
} else {
  console.log("NO VITE_BE_PORT");
}
