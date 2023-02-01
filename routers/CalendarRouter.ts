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
  server.post(
    "/createmonth",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newMonth = await prisma.months.create({
          data,
        });

        return newMonth;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/updatemonth",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.months.update({
          where: {
            id: data.id,
          },
          data,
        });

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post("/sortmonths", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const indexes: { id: string; parent: string; sort: number }[] =
        JSON.parse(req.body);
      const updates = indexes.map((idx) =>
        prisma.months.update({
          data: {
            parentId: idx.parent,
            sort: idx.sort,
          },
          where: { id: idx.id },
        })
      );
      await prisma.$transaction(async () => {
        Promise.all(updates);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
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
