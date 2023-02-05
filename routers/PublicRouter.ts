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

  done();
};
