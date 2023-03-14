import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";

export const tagRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/alltags/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const { project_id } = req.params;
        const tags = await prisma.tags.findMany({
          where: {
            project_id,
          },
          select: {
            id: true,
            title: true,
          },
        });
        rep.send(tags);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createtag",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const { id, title, project_id, ...rest } = JSON.parse(req.body) as {
          project_id: string;
          title: string;
          textColor: string;
          bgColor: string;
          [key: string]: any;
        };
        await prisma.tags.create({
          data: {
            id,
            title,
            project_id,
            ...rest,
          },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatetag",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      const { id, title, ...rest } = JSON.parse(req.body) as {
        id: string;
        title: string;
        [key: string]: any;
      };
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
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletetags",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const { ids } = JSON.parse(req.body) as { ids: string[] };

        await prisma.tags.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
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
                folder: true,
              },
            },
            maps: {
              select: {
                id: true,
                title: true,
                icon: true,
                folder: true,
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
                folder: true,
              },
            },
            nodes: {
              select: {
                id: true,
                label: true,
                parentId: true,
              },
            },
            edges: {
              select: {
                id: true,
                label: true,
                parentId: true,
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
                folder: true,
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
                folder: true,
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
                folder: true,
                icon: true,
              },
            },
          },
        });
        rep.send(tags);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
