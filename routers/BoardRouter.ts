import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const boardRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallboards/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      const data = await prisma.boards.findMany({
        where: {
          project_id: req.params.project_id,
        },
        select: {
          id: true,
          title: true,
          folder: true,
          sort: true,
          icon: true,
          parentId: true,
          isPublic: true,
          tags: true,
          defaultEdgeColor: true,
          defaultNodeColor: true,
          defaultNodeShape: true,
          parent: {
            select: {
              id: true,
              title: true,
            },
          },
          expanded: true,
        },
        orderBy: {
          sort: "asc",
        },
      });
      return data;
    }
  );
  server.post(
    "/getsingleboard",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const board = await prisma.boards.findUnique({
          where: {
            id: data.id,
          },
          include: {
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
            nodes: {
              include: {
                document: {
                  select: {
                    image: true,
                  },
                },
                tags: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
            edges: {
              include: {
                tags: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        });
        return board;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/createboard",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newBoard = await prisma.boards.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        return newBoard;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updateboard",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newDocument = await prisma.boards.update({
          data,
          where: {
            id: data.id,
          },
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post("/sortboards", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const indexes: { id: string; parent: string; sort: number }[] =
        JSON.parse(req.body);
      const updates = indexes.map((idx) =>
        prisma.boards.update({
          data: {
            parentId: idx.parent,
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
  server.delete(
    "/deleteboard",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.boards.delete({
          where: { id: data.id },
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post(
    "/createnode",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;

        const newNode = await prisma.nodes.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        return newNode;
      } catch (error) {
        console.log(error);
        return new Error("Cannot create node.");
      }
    }
  );
  server.delete(
    "/deletemanynodes",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const ids: string[] = JSON.parse(req.body);
        await prisma.edges.deleteMany({
          where: {
            OR: [
              {
                source_id: {
                  in: ids,
                },
              },
              {
                target_id: {
                  in: ids,
                },
              },
            ],
          },
        });
        await prisma.nodes.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.delete(
    "/deletemanyedges",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const ids: string[] = JSON.parse(req.body);
        await prisma.edges.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });

        return true;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updatemanynodes",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const body: { ids: string[]; data: any } = JSON.parse(req.body);
        await prisma.nodes.updateMany({
          where: {
            id: {
              in: body.ids,
            },
          },
          data: removeNull(body.data) as any,
        });
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updatemanynodesposition",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const body: { id: string; x: number; y: number }[] = JSON.parse(
          req.body
        );
        const updates = body.map((node) =>
          prisma.nodes.update({
            where: { id: node.id },
            data: {
              x: node.x,
              y: node.y,
            },
          })
        );
        await prisma.$transaction(updates);
        return true;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updatemanyedges",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const body: { ids: string[]; data: any } = JSON.parse(req.body);
        await prisma.edges.updateMany({
          where: {
            id: {
              in: body.ids,
            },
          },
          data: removeNull(body.data) as any,
        });
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updatenode",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const updatedNode = await prisma.nodes.update({
          where: {
            id: data.id,
          },
          data,
        });

        return updatedNode;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/createedge",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;

        const newEdge = await prisma.edges.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        return newEdge;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );
  server.post(
    "/updateedge",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newDocument = await prisma.edges.update({
          where: {
            id: data.id,
          },
          data: removeNull(JSON.parse(req.body)) as any,
        });

        return newDocument;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
  );

  done();
};
