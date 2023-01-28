import { FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const dictionaryRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get(
    "/getalldictionaries/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      try {
        const data = await prisma.dictionaries.findMany({
          where: {
            project_id: req.params.project_id,
            OR: [
              {
                project: {
                  ownerId: req.user_id,
                },
              },
              {
                project: {
                  members: {
                    some: {
                      auth_id: req.user_id,
                    },
                  },
                },
              },
            ],
          },
        });
        return data;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );

  server.post(
    "/getsingledictionary",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const dictionary = await prisma.dictionaries.findUnique({
          where: {
            id: data.id,
          },
          include: {
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
            words: {
              orderBy: {
                title: "asc",
              },
            },
          },
        });
        return dictionary;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/createdictionary",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newDictionary = await prisma.dictionaries.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        return newDictionary;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/updatedictionary",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newDictionary = await prisma.dictionaries.update({
          data,
          where: {
            id: data.id,
          },
        });

        return newDictionary;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/sortdictionaries",
    async (req: FastifyRequest<{ Body: string }>) => {
      const indexes: { id: string; parent: string; sort: number }[] =
        JSON.parse(req.body);
      const updates = indexes.map((idx) =>
        prisma.dictionaries.update({
          data: {
            parentId: idx.parent,
            sort: idx.sort,
          },
          where: { id: idx.id },
        })
      );
      await prisma.$transaction(updates);
    }
  );
  server.delete(
    "/deletedictionary",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      const data = JSON.parse(req.body) as { id: string };
      await prisma.dictionaries.delete({
        where: { id: data.id },
      });
    }
  );

  // WORD ROUTES

  server.post(
    "/createword",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.words.create({
          data,
        });

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );

  server.post(
    "/getsingleword",
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
