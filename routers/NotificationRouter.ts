import { FastifyInstance, FastifyReply } from "fastify";
import { on } from "events";
import { eventEmitter } from "../utils/events";

export const notificationRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get("/notifications", { websocket: true }, (connection) => {
    eventEmitter.on("new_notification", (event) => {
      connection.socket.send(JSON.stringify(event));
    });
  });
  done();
};
