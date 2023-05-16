import { FastifyInstance, FastifyReply } from "fastify";
import { on } from "events";
import { eventEmitter } from "../utils/events";

export const notificationRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get("/notifications", (req, res) => {
    console.log("TEST");

    eventEmitter.on("new_notification", (event) => {
      server.io.emit("new_notification", event);
    });
  });
  done();
};
