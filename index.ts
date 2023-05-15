import cors from "@fastify/cors";

import fastify from "fastify";

import { clerkPlugin, getAuth } from "@clerk/fastify";
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

// declare module "fastify" {
//   interface FastifyRequest {
//     isLocal: boolean;
//   }
// }

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

server.register(cors, {
  origin: (origin, cb) => {
    if (process.env.NODE_ENV === "development") {
      cb(null, true);
      return;
    }
    const hostname = new URL(origin).hostname;
    if (hostname === process.env.ALLOWED_URL) {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

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

server.register(fileUpload);

server.register(otherRouter);

server.register(async (instance, _, done) => {
  instance.addHook("preHandler", async (request, reply) => {
    const { userId, sessionId } = getAuth(request);
    if (!sessionId) {
      reply.status(401);
      reply.send({ error: "User could not be verified" });
    }
    if (!userId) {
      reply.code(403);
      throw new Error("NOT AUTHORIZED");
    }
  });
  instance.register(userRouter);
  instance.register(projectRouter);
  instance.register(searchRouter);
  instance.register(tagRouter);
  instance.register(documentRouter);
  instance.register(mapRouter);
  instance.register(boardRouter);
  instance.register(calendarRouter);
  instance.register(timelineRouter);
  instance.register(screenRouter);
  instance.register(dictionaryRouter);
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
      console.log("==============================");
    }
  );
} else {
  console.log("NO VITE_BE_PORT");
}
