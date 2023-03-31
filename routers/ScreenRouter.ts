import { screens } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import prisma from "../client";

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
        rep.send(screens);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  ),
    server.post(
      "/getsinglescreen",
      async (
        req: FastifyRequest<{ Body: { id: string } }>,
        rep: FastifyReply
      ) => {
        const data = req.body;
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
          rep.send(screens);
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    ),
    server.post(
      "/createscreen",
      async (
        req: FastifyRequest<{
          Body: Pick<screens, "title" | "sectionSize" | "project_id">;
        }>,
        rep: FastifyReply
      ) => {
        try {
          const data = req.body;

          const newScreen = await prisma.screens.create({
            data: {
              title: data.title,
              project_id: data.project_id,
              sectionSize: data.sectionSize,
            },
          });
          rep.send(newScreen);
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    ),
    server.post(
      "/sortscreens",
      async (
        req: FastifyRequest<{
          Body: { id: string; parentId: string; sort: number }[];
        }>,
        rep: FastifyReply
      ) => {
        try {
          const indexes = req.body;
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
          rep.send(true);
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    );
  server.post(
    "/createsection",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
          section: string;
          parentId: string;
          sort: number;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const newSection = await prisma.sections.create({
          data: {
            id: data.id,
            title: data.title,
            parentId: data.parentId,
            sort: data.sort,
          },
        });
        rep.send(newSection);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  ),
    server.post(
      "/updatesection",
      async (
        req: FastifyRequest<{
          Body: {
            id: string;
            title: string;
            size: string;
          };
        }>,
        rep: FastifyReply
      ) => {
        const data = req.body;
        try {
          await prisma.sections.update({
            where: {
              id: data.id,
            },
            data,
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
    "/updatecard",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          sort: number;
          expanded: boolean;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.cards.update({
          where: {
            id: data.id,
          },
          data,
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  ),
    server.post(
      "/createcard",
      async (
        req: FastifyRequest<{
          Body: {
            id: string;
            parentId: string;
            documentsId: string;
          }[];
        }>,
        rep: FastifyReply
      ) => {
        try {
          const data = req.body;
          const newCards = await prisma.cards.createMany({
            data,
          });
          rep.send(newCards);
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    ),
    server.post(
      "/sortsections",
      async (
        req: FastifyRequest<{
          Body: { id: string; parentId: string; sort: number }[];
        }>,
        rep: FastifyReply
      ) => {
        try {
          const indexes = req.body;
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
          rep.send(true);
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    );
  server.post(
    "/sortcards",
    async (
      req: FastifyRequest<{
        Body: { id: string; parentId: string; sort: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const indexes = req.body;
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatescreen",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
          icon: string;
          folder: boolean;
          isPublic: boolean;
          expanded: boolean;
          sort: number;
        };
      }>,
      rep: FastifyReply
    ) => {
      const data = req.body;
      try {
        await prisma.screens.update({
          where: {
            id: data.id,
          },
          data,
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
    "/deletescreen",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      const data = req.body;
      try {
        await prisma.screens.delete({
          where: {
            id: data.id,
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
    "/deletemanysections",
    async (req: FastifyRequest<{ Body: string[] }>, rep: FastifyReply) => {
      const ids = req.body;
      try {
        await prisma.sections.deleteMany({
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
  server.delete(
    "/deletecard",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      const data = req.body;
      try {
        await prisma.cards.delete({
          where: {
            id: data.id,
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
  done();
};
