import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "..";
import { removeNull } from "../utils/transform";

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
          include: {
            calendars: {
              select: {
                id: true,
                title: true,

                events: {
                  include: {
                    month: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                  },
                  orderBy: {
                    year: "asc",
                  },
                },
              },
            },
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
  server.post(
    "/createtimeline",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newTimeline = await prisma.timelines.create({
          data: {
            ...data,
            calendars: {
              connect: data?.calendars?.map((id: string) => ({
                id,
              })),
            },
          },
        });

        return newTimeline;
      } catch (error) {
        console.log(error);
        rep.status(500);
        return false;
      }
    }
  );
  server.post(
    "/updatetimeline",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const updatedTimeline = await prisma.timelines.update({
          where: {
            id: data.id,
          },
          data: {
            ...data,
            calendars: {
              connect: data?.calendars?.map((id: string) => ({
                id,
              })),
            },
          },
        });
        return updatedTimeline;
      } catch (error) {
        console.log(error);
        rep.status(500);
        return false;
      }
    }
  );
  server.delete(
    "/deletetimeline",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.timelines.delete({
          where: { id: data.id },
        });
        return true;
      } catch (error) {
        console.log(error);
        rep.status(500);
        return false;
      }
    }
  );
  done();
};
