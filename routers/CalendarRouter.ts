import { FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const calendarRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallcalendars/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      try {
        const calendars = await prisma.calendars.findMany({
          where: {
            project_id: req.params.project_id,
          },
        });
        return calendars;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/getsinglecalendar",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const calendar = await prisma.calendars.findUnique({
          where: {
            id: data.id,
          },
          include: {
            eras: true,
            months: {
              include: {
                events: true,
              },
            },
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        return calendar;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/createcalendar",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newCalendar = await prisma.calendars.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        return newCalendar;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/updatecalendar",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newCalendar = await prisma.calendars.update({
          where: {
            id: data.id,
          },
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        return newCalendar;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.delete(
    "/deletecalendar",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      const data = JSON.parse(req.body) as { id: string };
      await prisma.calendars.delete({
        where: { id: data.id },
      });
    }
  );

  done();
};
