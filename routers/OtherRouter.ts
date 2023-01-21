import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";

export const otherRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/health_check", async (_, rep: FastifyReply) => {
    rep.code(200).send({ status: "UP AND RUNNING" });
  });
  done();
};
