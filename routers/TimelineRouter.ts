import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";
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
        rep.send(timelines);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
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
        rep.send(timeline);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
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

        rep.send(newTimeline);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
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
        rep.send(updatedTimeline);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
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
        rep.send(true);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  done();
};