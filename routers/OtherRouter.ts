import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const otherRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/health_check", async (_, rep: FastifyReply) => {
    rep.code(200).send();
  });
  done();
};
