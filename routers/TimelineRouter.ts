import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "..";

export const timelineRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getalltimelines/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const timelines = await prisma.timelines.findMany({
          where: {
            project_id: req.params.project_id,
          },
          orderBy: {
            sort: "asc",
          },
        });
        return timelines;
      } catch (error) {
        rep.status(500);
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/getsingletimeline",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const timeline = await prisma.timelines.findUnique({
          where: {
            id: data.id,
          },
        });
        return timeline;
      } catch (error) {
        rep.status(500);
        console.log(error);
        return false;
      }
    }
  );
  done();
};
