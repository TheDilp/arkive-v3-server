import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getalldocuments/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
    const data = await prisma.documents.findMany({
      where: {
        project_id: req.params.project_id,
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
  });

  server.get("/getsingledocument/:id", async (req: FastifyRequest<{ Params: { id: string } }>) => {
    const doc = await prisma.documents.findUnique({
      where: { id: req.params.id },
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
  });

  server.post(
    "/createdocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newDocument = await prisma.documents.create({
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updatedocument/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        const newDocument = await prisma.documents.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post("/sortdocuments", async (req: FastifyRequest<{ Body: string }>) => {
    const indexes: { id: string; parent: string; sort: number }[] = JSON.parse(req.body);
    const updates = indexes.map((idx) =>
      prisma.documents.update({
        data: {
          parentId: idx.parent,
          sort: idx.sort,
        },
        where: { id: idx.id },
      }),
    );
    await prisma.$transaction(updates);
  });
  server.delete(
    "/deletedocument/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
    ) => {
      await prisma.documents.delete({
        where: {
          id: req.params.id,
        },
      });
    },
  );
  server.delete(
    "/deletemanydocuments",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
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
    },
  );

  done();
};
