import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import { prisma } from "..";

export const screenRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallscreens/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const screens = await prisma.screens.findMany({
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

        rep.code(200);
        return screens;
      } catch (error) {}
    }
  ),
    server.get(
      "/getsinglescreen/:id",
      async (req: FastifyRequest<{ Params: { id: string } }>) => {
        try {
          const screens = await prisma.screens.findUnique({
            where: {
              id: req.params.id,
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
            include: {
              sections: {
                include: {
                  cards: true,
                },
              },
            },
          });
          return screens;
        } catch (error) {
          return false;
        }
      }
    ),
    server.post(
      "/createscreen",
      async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
        try {
          const data = JSON.parse(req.body) as {
            title: string;
            project_id: string;
          };
          const newScreen = await prisma.screens.create({
            data: {
              title: data.title,
              project_id: data.project_id,
            },
          });
          rep.code(200);
          return true;
        } catch (error) {
          rep.code(500);
          return false;
        }
      }
    ),
    server.post(
      "/createsection",
      async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
        const data = JSON.parse(req.body) as {
          title: string;
          section: string;
          parentId: string;
        };
        const section = await prisma.sections.create({
          data: {
            title: data.title,
            size: data.section,
            parentId: data.parentId,
          },
        });
        rep.code(200);
        return true;
      }
    ),
    server.post(
      "/updatescreen/:id",
      async (req: FastifyRequest<{ Params: { id: string }; Body: string }>) => {
        const data = JSON.parse(req.body) as {
          title: string;
          icon: string;
          folder: boolean;
          isPublic: boolean;
          expanded: boolean;
          sort: number;
        };
        try {
          await prisma.screens.update({
            where: {
              id: req.params.id,
            },
            data,
          });
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    );
  server.delete(
    "/deletescreen/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      try {
        await prisma.screens.delete({
          where: {
            id: req.params.id,
          },
        });
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
  );
  done();
};
