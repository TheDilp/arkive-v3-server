import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { removeNull } from "../utils/transform";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getalldocuments/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
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
        rep.send(data);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/getsingledocument",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const doc = await prisma.documents.findUnique({
          where: { id: data.id },
          select: {
            id: true,
            title: true,
            content: true,
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
            alter_names: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(doc);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/getmanydocuments",
    async (req: FastifyRequest<{ Body: string[] }>, rep: FastifyReply) => {
      const ids = req.body;
      try {
        const documents = await prisma.documents.findMany({
          where: {
            id: {
              in: ids,
            },
          },
          select: {
            id: true,
            title: true,
            content: true,
          },
        });
        rep.send(documents);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/createdocument",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        const { tags, alter_names, ...rest } = data;
        const newDocument = await prisma.documents.create({
          data: {
            alter_names: {
              create: alter_names,
            },
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
            ...rest,
          },
          include: {
            alter_names: true,
            tags: true,
          },
        });

        rep.send(newDocument);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/createfromtemplate",
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          template_id: string;
          project_id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const templateContent = await prisma.documents.findUnique({
          where: { id: data.template_id },
          select: {
            content: true,
          },
        });
        if (templateContent) {
          const newDocument = await prisma.documents.create({
            data: {
              title: data.title,
              content: templateContent.content as any,
              project_id: data.project_id,
            },
          });
          rep.send(newDocument);
          return;
        }
        rep.code(500);
        rep.send(false);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/updatedocument",
    async (
      req: FastifyRequest<{
        Body: { [key: string]: any };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.documents.update({
          data: {
            ...data,
            tags: {
              set: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
            alter_names: {
              set: data?.alter_names?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
          where: { id: data.id },
        });
        rep.code(200);
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/sortdocuments",
    async (
      req: FastifyRequest<{
        Body: { id: string; parent: string; sort: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const indexes = req.body;
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
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.delete(
    "/deletedocument",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.documents.delete({
          where: {
            id: data.id,
          },
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.delete(
    "/deletemanydocuments",
    async (
      req: FastifyRequest<{
        Body: string[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const ids = req.body;
        if (ids)
          await prisma.documents.deleteMany({
            where: {
              id: {
                in: ids,
              },
            },
          });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );

  done();
};
