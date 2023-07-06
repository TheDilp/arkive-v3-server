import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "../client";

import { asc, eq } from "drizzle-orm";
import {
  documents,
  edges,
  graphs,
  graphsTotags,
  images,
  nodes,
  tags,
} from "../drizzle/schema";
import { db } from "../utils";
import { removeNull } from "../utils/transform";

export const graphRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/",
    async (
      req: FastifyRequest<{ Body: { data: { parentId: string } } }>,
      rep
    ) => {
      const data = await db
        .select({
          id: graphs.id,
          title: graphs.title,
          isFolder: graphs.isFolder,
          icon: graphs.icon,
          parentId: graphs.parentId,
        })
        .from(graphs)
        .where(eq(graphs.parentId, req.body.data.parentId))
        .orderBy(asc(graphs.title));

      if (data) {
        rep.send({ data, message: "Success", ok: true });
      }
    }
  );
  server.get(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
      const tagsQuery = db
        .select()
        .from(graphsTotags)
        .leftJoin(graphs, eq(graphs.id, graphsTotags.a))
        .leftJoin(tags, eq(tags.id, graphsTotags.b))
        .where(eq(graphs.id, req.params.id))
        .as("tagsQuery");

      const nodesQuery = db
        .select()
        .from(nodes)
        .where(eq(nodes.parentId, req.params.id))
        .leftJoin(documents, eq(documents.id, nodes.docId))
        .leftJoin(images, eq(documents.imageId, images.id))
        .as("nodeDocumentsQuery");

      const data = await db
        .select()
        .from(graphs)
        .leftJoin(nodes, eq(nodes.parentId, graphs.id))
        .leftJoin(edges, eq(edges.parentId, graphs.id))
        .leftJoin(tagsQuery, eq(graphs.id, tagsQuery.graphs.id))
        .leftJoin(nodesQuery, eq(nodes.parentId, req.params.id));

      if (data) {
        rep.send({ data: data[0], message: "Success", ok: true });
      }
    }
  );
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: JSON;
      }>,
      rep
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
        console.error(error);
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
      rep
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.boards.update({
          data: {
            ...data,
            tags: {
              set: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
          where: {
            id: data.id,
          },
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
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
      rep
    ) => {
      try {
        const indexes = req.body;
        const updates = indexes.map((idx) =>
          prisma.boards.update({
            data: {
              parent_id: idx.parent,
              sort: idx.sort,
            },
            where: { id: idx.id },
          })
        );
        await prisma.$transaction(updates);
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
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
      rep
    ) => {
      try {
        const data = req.body;
        await prisma.boards.delete({
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
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
      rep
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
        console.error(error);
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
      rep
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
        console.error(error);
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
      rep
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
        console.error(error);
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
      rep
    ) => {
      try {
        const body = req.body;
        const data = removeNull(body.data) as any;
        const transactions = body.ids.map((id) =>
          prisma.nodes.update({
            where: {
              id,
            },
            data: {
              ...data,
              tags: {
                set: data?.tags?.map((tag: { id: string }) => ({
                  id: tag.id,
                })),
              },
            },
          })
        );

        await prisma.$transaction(transactions);
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
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
      rep
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
        console.error(error);
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
      rep
    ) => {
      try {
        const body = req.body;
        const data = removeNull(body.data) as any;
        const transactions = body.ids.map((id) =>
          prisma.edges.update({
            where: {
              id,
            },
            data: {
              ...data,
              tags: {
                set: data?.tags?.map((tag: { id: string }) => ({
                  id: tag.id,
                })),
              },
            },
          })
        );

        await prisma.$transaction(transactions);
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
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
      rep
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.nodes.update({
          where: {
            id: data.id,
          },
          data: {
            ...data,
            tags: {
              set: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
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
      rep
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
        console.error(error);
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
      rep
    ) => {
      try {
        const data = removeNull(req.body) as any;
        await prisma.edges.update({
          where: {
            id: data.id,
          },
          data: {
            ...data,
            tags: {
              set: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  done();
};
