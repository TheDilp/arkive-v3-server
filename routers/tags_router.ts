import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { db, insertTagSchema } from "../utils";
import { tags } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { eq } from "drizzle-orm";

export const tagsRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/:projectId",
    async (
      req: FastifyRequest<{ Params: { projectId: string } }>,
      rep: FastifyReply
    ) => {
      const data = await db
        .select()
        .from(tags)
        .where(eq(tags.projectId, req.params.projectId));
      if (data) {
        rep.send({ data, message: ResponseEnum.generic, ok: true });
      }
    }
  );
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: typeof insertTagSchema;
        };
      }>,
      rep: FastifyReply
    ) => {
      const data = insertTagSchema.parse(req.body.data);
      if (data) {
        await db.insert(tags).values(data);
        rep.send({ message: ResponseEnum.created("Tags"), ok: true });
      }
    }
  );
  server.post(
    "/updatetag",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
          [key: string]: any;
        };
      }>,
      rep: FastifyReply
    ) => {
      const { id, title, ...rest } = req.body;
      try {
        await prisma.tags.update({
          where: {
            id,
          },
          data: {
            title,
            ...rest,
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
  server.delete(
    "/deletetags",
    async (
      req: FastifyRequest<{ Body: { ids: string[] } }>,
      rep: FastifyReply
    ) => {
      try {
        const { ids } = req.body;

        await prisma.tags.deleteMany({
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
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.get(
    "/alltags/settings/:projectId",
    async (
      req: FastifyRequest<{ Params: { projectId: string }; Body: string }>,
      rep: FastifyReply
    ) => {
      try {
        const { projectId } = req.params;
        rep.send(tags);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );

  done();
};
