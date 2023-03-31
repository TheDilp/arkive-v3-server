import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";

import { removeNull } from "../utils/transform";

export const boardRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallboards/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
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
        rep.send(data);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsingleboard",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
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
                    id: true,
                    title: true,
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
        rep.send(board);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createboard",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
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
        rep.send(newBoard);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updateboard",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.boards.update({
          data,
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
  server.post(
    "/sortboards",
    async (
      req: FastifyRequest<{
        Body: { id: string; parent: string; sort: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const indexes = req.body;
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleteboard",
    async (
      req: FastifyRequest<{
        Body: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.boards.delete({
          where: { id: data.id },
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
    "/createnode",
    async (
      req: FastifyRequest<{
        Body: JSON;
        Params: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;

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

        rep.send(newNode);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletemanynodes",
    async (
      req: FastifyRequest<{
        Body: string[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const ids = req.body;
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletemanyedges",
    async (
      req: FastifyRequest<{
        Body: string[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const ids = req.body;
        await prisma.edges.deleteMany({
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
  server.post(
    "/updatemanynodes",
    async (
      req: FastifyRequest<{
        Body: { ids: string[]; data: any };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const body = req.body;
        await prisma.nodes.updateMany({
          where: {
            id: {
              in: body.ids,
            },
          },
          data: removeNull(body.data) as any,
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
    "/updatemanynodesposition",
    async (
      req: FastifyRequest<{
        Body: { id: string; x: number; y: number }[];
      }>,
      rep: FastifyReply
    ) => {
      try {
        const body = req.body;
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatemanyedges",
    async (
      req: FastifyRequest<{
        Body: { ids: string[]; data: any };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const body = req.body;
        await prisma.edges.updateMany({
          where: {
            id: {
              in: body.ids,
            },
          },
          data: removeNull(body.data) as any,
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
    "/updatenode",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.nodes.update({
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
    "/createedge",
    async (
      req: FastifyRequest<{
        Body: JSON;
        Params: { id: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.edges.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
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
  server.post(
    "/updateedge",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.edges.update({
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

  done();
};
