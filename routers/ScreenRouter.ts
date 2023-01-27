import { screens } from "@prisma/client";
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
                  cards: {
                    include: {
                      document: {
                        select: {
                          id: true,
                          title: true,
                          content: true,
                        },
                      },
                    },
                    orderBy: {
                      sort: "asc",
                    },
                  },
                },
                orderBy: {
                  sort: "asc",
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
          const data = JSON.parse(req.body) as Pick<
            screens,
            "title" | "sectionSize" | "project_id"
          >;

          await prisma.screens.create({
            data: {
              title: data.title,
              project_id: data.project_id,
              sectionSize: data.sectionSize,
            },
          });
          rep.code(200);
          return true;
        } catch (error) {
          console.log(error);
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
          sort: number;
        };
        await prisma.sections.create({
          data: {
            title: data.title,
            parentId: data.parentId,
            sort: data.sort,
          },
        });
        rep.code(200);
        return true;
      }
    ),
    server.post(
      "/updatesection/:id",
      async (req: FastifyRequest<{ Params: { id: string }; Body: string }>) => {
        const data = JSON.parse(req.body) as {
          title: string;
          size: string;
        };
        try {
          await prisma.sections.update({
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
  server.post(
    "/updatecard/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: string }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as {
          sort: number;
          expanded: boolean;
        };
        await prisma.cards.update({
          where: {
            id: req.params.id,
          },
          data,
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
      "/createcard",
      async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
        try {
          const data = JSON.parse(req.body) as {
            id: string;
            parentId: string;
            documentsId: string;
          }[];
          await prisma.cards.createMany({
            data,
          });
          rep.code(200);
          return true;
        } catch (error) {
          console.log(error);
          rep.code(500);
          return false;
        }
      }
    ),
    server.post(
      "/sortsections",
      async (req: FastifyRequest<{ Body: string }>) => {
        try {
          const indexes: { id: string; parentId: string; sort: number }[] =
            JSON.parse(req.body);
          const updates = indexes.map((idx) =>
            prisma.sections.update({
              data: {
                parentId: idx.parentId,
                sort: idx.sort,
              },
              where: { id: idx.id },
            })
          );
          await prisma.$transaction(updates);
          return true;
        } catch (error) {
          return false;
        }
      }
    );
  server.post("/sortcards", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const indexes: { id: string; parentId: string; sort: number }[] =
        JSON.parse(req.body);
      const updates = indexes.map((idx) =>
        prisma.cards.update({
          data: {
            parentId: idx.parentId,
            sort: idx.sort,
          },
          where: { id: idx.id },
        })
      );
      await prisma.$transaction(updates);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
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
  server.delete(
    "/deletemanysections",
    async (req: FastifyRequest<{ Body: string }>) => {
      const ids = JSON.parse(req.body) as string[];
      try {
        await prisma.sections.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
  );
  server.delete(
    "/deletecard/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      try {
        await prisma.cards.delete({
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
