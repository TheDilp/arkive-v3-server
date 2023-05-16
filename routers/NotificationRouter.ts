import { FastifyInstance, FastifyReply } from "fastify";
import { on } from "events";
import { eventEmitter } from "../utils/events";

export const notificationRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get("/notifications", (req, res) => {
    res.sse(
      (async function* () {
        for await (const [event] of on(eventEmitter, "new_notification")) {
          yield {
            event: event.name,
            data: JSON.stringify(event),
          };
        }
      })()
    );
  });
  done();
};
