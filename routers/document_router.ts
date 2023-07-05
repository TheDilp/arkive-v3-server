import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { and, eq } from "drizzle-orm";
import prisma from "../client";
import {
  alterNames,
  documents,
  documentsTotags,
  images,
  tags,
} from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { db, insertDocumentSchema, updateDocumentSchema } from "../utils";
import { removeNull } from "../utils/transform";

export const documentRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/:projectId/:parentId",
    async (
      req: FastifyRequest<{ Params: { projectId: string; parentId: string } }>,
      rep
    ) => {
      const tagsQuery = db
        .select()
        .from(documentsTotags)
        .leftJoin(documents, eq(documents.id, documentsTotags.a))
        .leftJoin(tags, eq(tags.id, documentsTotags.b))
        .where(eq(documents.parentId, req.params.parentId))
        .as("tagsQuery");
      const data = await db
        .select({
          id: documents.id,
          title: documents.title,
          icon: documents.icon,
          parentId: documents.parentId,
          isTemplate: documents.isTemplate,
          isFolder: documents.isFolder,
          isPublic: documents.isPublic,
          projectId: documents.projectId,
        })
        .from(documents)
        .where(
          and(
            eq(documents.projectId, req.params.projectId),
            eq(documents.parentId, req.params.parentId)
          )
        )
        .leftJoin(alterNames, eq(alterNames.parentId, documents.id))
        .leftJoin(images, eq(images.id, documents.imageId))
        .leftJoin(tagsQuery, eq(documents.id, tagsQuery.documents.id));

      rep.send({ data, message: ResponseEnum.generic(), ok: true });
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
        console.error(error);
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
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: typeof insertDocumentSchema;
        };
      }>,
      rep: FastifyReply
    ) => {
      const data = insertDocumentSchema.parse(req.body.data);
      if (data) {
        const [document] = await db.insert(documents).values(data).returning();
        rep.send({
          data: document,
          message: ResponseEnum.created("Document"),
          ok: true,
        });
      }
    }
  );

  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          data: typeof updateDocumentSchema;
        };
      }>,
      rep: FastifyReply
    ) => {
      const data = updateDocumentSchema.parse(req.body.data);
      if (data) {
        await db
          .update(documents)
          .set(data)
          .where(eq(documents.id, req.params.id));

        rep.send({ message: ResponseEnum.updated("Document"), ok: true });
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
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  // server.delete(
  //   "/deletemanydocuments",
  //   async (
  //     req: FastifyRequest<{
  //       Body: string[];
  //     }>,
  //     rep: FastifyReply
  //   ) => {
  //     try {
  //       const ids = req.body;
  //       if (ids)
  //         await prisma.documents.deleteMany({
  //           where: {
  //             id: {
  //               in: ids,
  //             },
  //           },
  //         });
  //       rep.send(true);
  //       return;
  //     } catch (error) {
  //       rep.code(500);
  //       console.error(error);
  //       rep.send(false);
  //       return;
  //     }
  //   }
  // );

  done();
};
