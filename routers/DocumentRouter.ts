import { documents } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";
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
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsingledocument",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.send(doc);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getmanydocuments",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      const ids = JSON.parse(req.body) as string[];
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
      } catch (error) {
        console.log(error);
        rep.send(false);
      }
    }
  );

  server.post(
    "/createdocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
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

        rep.send(newDocument);
      } catch (error) {
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createfromtemplate",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as {
          title: string;
          template_id: string;
          project_id: string;
        };
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
        }
      } catch (error) {
        console.log(error);
        rep.send(false);
      }
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
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
          where: { id: data.id },
        });
        rep.code(200);
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/sortdocuments",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.send(true);
      } catch (error) {
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletedocument",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.documents.delete({
          where: {
            id: data.id,
          },
        });
        rep.send(true);
      } catch (error) {
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletemanydocuments",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const ids = JSON.parse(req.body) as string[];
        if (ids)
          await prisma.documents.deleteMany({
            where: {
              id: {
                in: ids,
              },
            },
          });
        rep.send(true);
      } catch (error) {
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
