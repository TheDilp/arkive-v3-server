import cors from "@fastify/cors";

import fastify, { errorCodes } from "fastify";

import fileUpload from "fastify-file-upload";
import {
  otherRouter,
  projectRouter,
  publicRouter,
  userRouter,
} from "./routers";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, migrationClient } from "./utils";
import { drizzle } from "drizzle-orm/postgres-js";

const server = fastify();

server.register(cors, {
  origin: (origin, cb) => {
    if (process.env.NODE_ENV === "development") {
      cb(null, true);
      return;
    }
    const hostname = new URL(origin as string).hostname;
    if (hostname === process.env.ALLOWED_URL) {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

server.register(fileUpload);
server.register(otherRouter);
server.register(
  async (instance, _, done) => {
    // INSERT AUTH HERE
    instance.register(userRouter, { prefix: "/users" });
    // instance.register(assetRouter, { prefix: "/assets" });
    instance.register(projectRouter, { prefix: "/projects" });
    // instance.register(documentRouter);
    // instance.register(mapRouter);
    // instance.register(boardRouter);
    // instance.register(calendarRouter);
    // instance.register(timelineRouter);
    // instance.register(screenRouter);
    // instance.register(dictionaryRouter);
    // instance.register(randomTableRouter);
    // instance.register(tagRouter);
    // instance.register(searchRouter);

    done();
  },
  {
    prefix: "api/v1",
  }
);

server.setErrorHandler(function (error, request, reply) {
  if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(500).send({ ok: false });
  } else {
    console.log(error);

    // fastify will use parent error handler to handle this
    reply.send(error);
  }
});

server.register(publicRouter);
if (process.env.SERVER_PORT) {
  server.listen(
    { port: parseInt(process.env.SERVER_PORT, 10) as number, host: "0.0.0.0" },
    async (err, address) => {
      await migrate(drizzle(migrationClient), {
        migrationsFolder: "./drizzle",
      });
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    }
  );
} else {
  console.error("NO SERVER_PORT");
}
