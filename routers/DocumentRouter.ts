import { documents } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getalldocuments/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      const data = await prisma.documents.findMany({
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
        select: {
          id: true,
          title: true,
          icon: true,
          parentId: true,
          parent: {
            select: {
              id: true,
              title: true,
            },
          },
          template: true,
          folder: true,
          sort: true,
          expanded: true,
          isPublic: true,
          project_id: true,
          alter_names: true,
          image: true,
          tags: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          sort: "asc",
        },
      });
      return data;
    }
  );
  server.post(
    "/getsingledocument",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const doc = await prisma.documents.findUnique({
          where: { id: data.id },
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
    "/getmanydocuments",
    async (req: FastifyRequest<{ Body: string }>) => {
      const ids = JSON.parse(req.body) as string[];
      try {
        const documents = await prisma.documents.findMany({
          where: {
            id: {
              in: ids,
            },
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
          select: {
            id: true,
            title: true,
            content: true,
          },
        });
        return documents;
      } catch (error) {
        return false;
      }
    }
  );

  server.post(
    "/createdocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const { tags, ...rest } = data;
        const newDocument = await prisma.documents.create({
          data: {
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
            ...rest,
          },
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updatedocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.documents.update({
          data,
          where: { id: data.id },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/sortdocuments",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const indexes: { id: string; parent: string; sort: number }[] =
          JSON.parse(req.body);
        const updates = indexes.map((idx) =>
          prisma.documents.update({
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
  server.delete(
    "/deletedocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.documents.delete({
          where: {
            id: data.id,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.delete(
    "/deletemanydocuments",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      const ids = JSON.parse(req.body) as string[];
      if (ids)
        await prisma.documents.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
      return true;
    }
  );

  done();
};
