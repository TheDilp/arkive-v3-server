import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import prisma from "../client";
import { removeNull } from "../utils/transform";

export const calendarRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallcalendars/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const calendars = await prisma.calendars.findMany({
          where: {
            project_id: req.params.project_id,
          },
          orderBy: {
            sort: "asc",
          },
        });
        rep.send(calendars);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.get(
    "/getallevents/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const calendars = await prisma.events.findMany({
          where: {
            calendar: {
              project_id: req.params.project_id,
            },
          },
          orderBy: {
            year: "asc",
          },
        });
        rep.send(calendars);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsinglecalendar",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const calendar = await prisma.calendars.findUnique({
          where: {
            id: data.id,
          },
          include: {
            eras: {
              orderBy: {
                start_year: "asc",
              },
            },
            months: {
              include: {
                events: {
                  include: {
                    tags: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                sort: "asc",
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
        rep.status(500);
        return false;
      }
    }
  );
  server.post(
    "/createcalendar",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
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

        rep.send(newCalendar);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatecalendar",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        const updatedCalendar = await prisma.calendars.update({
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

        rep.send(updatedCalendar);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/sortcalendars",
    async (
      req: FastifyRequest<{
        Body: { id: string; parent: string; sort: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const indexes = req.body;
        const updates = indexes.map((idx) =>
          prisma.calendars.update({
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

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createera",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.eras.create({
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updateera",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.eras.update({
          where: {
            id: data.id,
          },
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createmonth",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        const newMonth = await prisma.months.create({
          data,
        });

        rep.send(newMonth);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatemonth",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.months.update({
          where: {
            id: data.id,
          },
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/sortmonths",
    async (
      req: FastifyRequest<{
        Body: { id: string; parent: string; sort: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const indexes = req.body;
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
    }
  );
  server.post(
    "/createevent",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.events.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updateevent",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.events.update({
          where: {
            id: data.id,
          },
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  server.delete(
    "/deletecalendar",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.calendars.delete({
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleteera",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.eras.delete({
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletemonth",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.months.delete({
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleteevent",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.events.delete({
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
