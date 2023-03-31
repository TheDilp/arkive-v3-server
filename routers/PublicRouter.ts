import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";

export const publicRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/getpublicdocument",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const doc = await prisma.documents.findUnique({
          where: { id: data.id, isPublic: true },
          include: {
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(doc);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpublicmap",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const map = await prisma.maps.findUnique({
          where: { id: data.id, isPublic: true },
          include: {
            map_layers: {
              where: {
                isPublic: true,
              },
            },
            map_pins: {
              where: {
                isPublic: true,
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
        rep.send(map);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpublicboard",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const board = await prisma.boards.findUnique({
          where: { id: data.id, isPublic: true },
          include: {
            nodes: true,
            edges: true,
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(board);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpubliccalendar",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const word = await prisma.calendars.findUnique({
          where: { id: data.id },
          include: {
            eras: {
              orderBy: {
                start_year: "asc",
              },
            },
            months: {
              orderBy: {
                sort: "asc",
              },
            },
            events: {
              where: {
                isPublic: true,
              },
            },
          },
        });
        rep.send(word);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpublicword",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const word = await prisma.words.findUnique({
          where: { id: data.id },
          include: {
            dictionary: {
              select: {
                title: true,
              },
            },
          },
        });
        rep.send(word);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.get(
    "/publicuser/:user_id",
    async (
      req: FastifyRequest<{ Params: { user_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.params.user_id,
          },
          select: {
            image: true,
            nickname: true,
          },
        });
        rep.send(user);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
