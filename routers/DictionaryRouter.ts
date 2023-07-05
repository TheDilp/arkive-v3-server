import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import prisma from "../client";
import { removeNull } from "../utils/transform";

export const dictionaryRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get(
    "/getalldictionaries/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = await prisma.dictionaries.findMany({
          where: {
            project_id: req.params.project_id,
          },
        });
        rep.send(data);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsingledictionary",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
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
        rep.send(dictionary);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createdictionary",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
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

        rep.send(newDictionary);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatedictionary",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        const newDictionary = await prisma.dictionaries.update({
          data,
          where: {
            id: data.id,
          },
        });

        rep.send(newDictionary);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(error);
      }
    }
  );
  server.post(
    "/sortdictionaries",
    async (
      req: FastifyRequest<{
        Body: { id: string; parent: string; sort: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const indexes = req.body;
        const updates = indexes.map((idx) =>
          prisma.dictionaries.update({
            data: {
              parent_id: idx.parent,
            },
            where: { id: idx.id },
          })
        );
        await prisma.$transaction(updates);
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletedictionary",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.dictionaries.delete({
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  // WORD ROUTES

  server.post(
    "/createword",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.words.create({
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsingleword",
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
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updateword",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.words.update({
          where: {
            id: data.id,
          },
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleteword",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const id = req.body;
        await prisma.words.delete({
          where: {
            id,
          },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  done();
};
