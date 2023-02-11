import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "..";

export const publicRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/getpublicdocument",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
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
        return doc;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/getpublicmap",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
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
        return map;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/getpublicboard",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
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
        return board;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/getpubliccalendar",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
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
        return word;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/getpublicword",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
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
        return word;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.get(
    "/publicuser/:user_id",
    async (req: FastifyRequest<{ Params: { user_id: string } }>) => {
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
      } catch (error) {}
    }
  );

  done();
};
