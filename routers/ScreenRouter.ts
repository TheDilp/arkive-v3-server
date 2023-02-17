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
          },
          orderBy: {
            sort: "asc",
          },
        });

        rep.code(200);
        return screens;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  ),
    server.post(
      "/getsinglescreen",
      async (req: FastifyRequest<{ Body: string }>) => {
        const data = JSON.parse(req.body) as { id: string };
        try {
          const screens = await prisma.screens.findUnique({
            where: {
              id: data.id,
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

          const newScreen = await prisma.screens.create({
            data: {
              title: data.title,
              project_id: data.project_id,
              sectionSize: data.sectionSize,
            },
          });
          rep.code(200);
          return newScreen;
        } catch (error) {
          console.log(error);
          rep.code(500);
          return false;
        }
      }
    ),
    server.post(
      "/sortscreens",
      async (req: FastifyRequest<{ Body: string }>) => {
        try {
          const indexes: { id: string; parentId: string; sort: number }[] =
            JSON.parse(req.body);
          const updates = indexes.map((idx) =>
            prisma.screens.update({
              data: {
                parentId: idx.parentId,
                sort: idx.sort,
              },
              where: { id: idx.id },
            })
          );
          await prisma.$transaction(async () => {
            await Promise.all(updates);
          });
          return true;
        } catch (error) {
          return false;
        }
      }
    );
  server.post(
    "/createsection",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      const data = JSON.parse(req.body) as {
        title: string;
        section: string;
        parentId: string;
        sort: number;
      };
      const newSection = await prisma.sections.create({
        data: {
          title: data.title,
          parentId: data.parentId,
          sort: data.sort,
        },
      });
      rep.code(200);
      return newSection;
    }
  ),
    server.post(
      "/updatesection",
      async (req: FastifyRequest<{ Body: string }>) => {
        const data = JSON.parse(req.body) as {
          id: string;
          title: string;
          size: string;
        };
        try {
          await prisma.sections.update({
            where: {
              id: data.id,
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
    "/updatecard",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as {
          id: string;
          sort: number;
          expanded: boolean;
        };
        await prisma.cards.update({
          where: {
            id: data.id,
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
          const newCards = await prisma.cards.createMany({
            data,
          });
          rep.code(200);
          return newCards;
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
          await prisma.$transaction(async () => {
            await Promise.all(updates);
          });
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
      await prisma.$transaction(async () => {
        await Promise.all(updates);
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  server.post(
    "/updatescreen",
    async (req: FastifyRequest<{ Body: string }>) => {
      const data = JSON.parse(req.body) as {
        id: string;
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
            id: data.id,
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
    "/deletescreen",
    async (req: FastifyRequest<{ Body: string }>) => {
      const data = JSON.parse(req.body) as { id: string };
      try {
        await prisma.screens.delete({
          where: {
            id: data.id,
          },
        });
        return true;
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
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
  );
  server.delete(
    "/deletecard",
    async (req: FastifyRequest<{ Body: string }>) => {
      const data = JSON.parse(req.body) as { id: string };
      try {
        await prisma.cards.delete({
          where: {
            id: data.id,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
  );
  done();
};
