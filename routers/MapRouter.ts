import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { removeNull } from "../utils/transform";

export const mapRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallmaps/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = await prisma.maps.findMany({
          select: {
            id: true,
            title: true,
            project_id: true,
            icon: true,
            image: true,
            sort: true,
            expanded: true,
            folder: true,
            isPublic: true,
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
            parent: {
              select: {
                id: true,
                title: true,
              },
            },
            parentId: true,
          },
          orderBy: {
            sort: "asc",
          },
          where: {
            project_id: req.params.project_id,
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
    "/getsinglemap",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const map = await prisma.maps.findUnique({
          where: {
            id: data.id,
          },
          include: {
            map_pins: true,
            map_layers: true,
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(map);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  server.post(
    "/createmap",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newMap = await prisma.maps.create({
          data: {
            ...data,
            tags: {
              connect: data?.tags?.map((tag: { id: string }) => ({
                id: tag.id,
              })),
            },
          },
        });

        rep.send(newMap);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createmappin",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const newMapPin = await prisma.map_pins.create({
          data: JSON.parse(req.body) as any,
        });

        rep.send(newMapPin);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createmaplayer",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const newMapLayer = await prisma.map_layers.create({
          data: JSON.parse(req.body) as any,
        });
        rep.send(newMapLayer);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatemappin",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.map_pins.update({
          data,
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error: any) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatemaplayer",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.map_layers.update({
          data,
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error: any) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updatemap",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.maps.update({
          data,
          where: { id: data.id },
        });
        rep.send(true);
      } catch (error: any) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/sortmaps",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const indexes: { id: string; parent: string; sort: number }[] =
          JSON.parse(req.body);
        const updates = indexes.map((idx) =>
          prisma.maps.update({
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
    "/deletemap",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.maps.delete({
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
  server.delete(
    "/deletemaplayer",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.map_layers.delete({
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
    "/deletemappin",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.map_pins.delete({
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
