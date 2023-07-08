import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { db } from "../utils";
import { tags } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";

export const tagsRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      const data = await db.select().from(tags);
      if (data) {
        rep.send({ data, message: ResponseEnum.generic, ok: true });
      }
    }
  );
  server.post(
    "/createtag",
    async (
      req: FastifyRequest<{
        Body: {
          project_id: string;
          title: string;
          textColor: string;
          bgColor: string;
          [key: string]: any;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id, title, project_id, ...rest } = req.body;
        await prisma.tags.create({
          data: {
            id,
            title,
            project_id,
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
    "/alltags/settings/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string }; Body: string }>,
      rep: FastifyReply
    ) => {
      try {
        const { project_id } = req.params;
        const tags = await prisma.tags.findMany({
          where: {
            project_id,
          },
          include: {
            documents: {
              select: {
                id: true,
                title: true,
                icon: true,
                isFolder: true,
              },
            },
            maps: {
              select: {
                id: true,
                title: true,
                icon: true,
                isFolder: true,
              },
            },
            map_pins: {
              select: {
                id: true,
                text: true,
                icon: true,
              },
            },
            boards: {
              select: {
                id: true,
                title: true,
                icon: true,
                isFolder: true,
              },
            },
            nodes: {
              select: {
                id: true,
                label: true,
                parent_id: true,
              },
            },
            edges: {
              select: {
                id: true,
                label: true,
                parent_id: true,
                source: {
                  select: {
                    label: true,
                  },
                },
                target: {
                  select: {
                    label: true,
                  },
                },
              },
            },
            calendars: {
              select: {
                id: true,
                title: true,
                icon: true,
                isFolder: true,
              },
            },
            events: {
              select: {
                id: true,
                title: true,
                calendarsId: true,
              },
            },
            screens: {
              select: {
                id: true,
                title: true,
                isFolder: true,
                icon: true,
              },
            },
            cards: {
              select: {
                id: true,
                document: {
                  select: {
                    title: true,
                  },
                },
              },
            },
            dictionaries: {
              select: {
                id: true,
                title: true,
                isFolder: true,
                icon: true,
              },
            },
          },
        });
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
  server.post(
    "/createaltername",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
          project_id: string;
          parent_id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id, title, project_id, parent_id } = req.body;
        await prisma.alter_names.create({
          data: {
            id,
            title,
            project_id,
            parent_id,
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
  server.post(
    "/updatealtername",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      const { id, title } = req.body;
      try {
        await prisma.alter_names.update({
          where: {
            id,
          },
          data: {
            title,
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
    "/deletealtername",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const id = req.body;
        await prisma.alter_names.delete({
          where: {
            id,
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
    "/allalternames/settings/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string }; Body: string }>,
      rep: FastifyReply
    ) => {
      try {
        const { project_id } = req.params;
        const alterNames = await prisma.alter_names.findMany({
          where: {
            project_id,
          },
          include: {
            document: {
              select: {
                id: true,
                title: true,
                icon: true,
                isFolder: true,
              },
            },
          },
        });
        rep.send(alterNames);
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
