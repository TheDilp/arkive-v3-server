import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const mapRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallmaps/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
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
    return data;
  });

  server.get("/getsinglemap/:id", async (req: FastifyRequest<{ Params: { id: string } }>) => {
    const data = await prisma.maps.findUnique({
      where: {
        id: req.params.id,
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
    return data;
  });

  server.post(
    "/createmap",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newMap = await prisma.maps.create({
          data: JSON.parse(req.body) as any,
        });

        return newMap;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/createmappin",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newMapPin = await prisma.map_pins.create({
          data: JSON.parse(req.body) as any,
        });

        return newMapPin;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/createmaplayer",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
    ) => {
      try {
        const newMapLayer = await prisma.map_layers.create({
          data: JSON.parse(req.body) as any,
        });

        return newMapLayer;
      } catch (error) {
        console.log(error);
      }
      return null;
    },
  );
  server.post(
    "/updatemappin/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        await prisma.map_pins.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return true;
      } catch (error: any) {
        console.log(error);
        return new Error(error);
      }
    },
  );
  server.post(
    "/updatemaplayer/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        await prisma.map_layers.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return true;
      } catch (error: any) {
        console.log(error);
        return new Error(error);
      }
    },
  );
  server.post(
    "/updatemap/:id",
    async (
      req: FastifyRequest<{
        Body: string;
        Params: { id: string };
      }>,
    ) => {
      try {
        await prisma.maps.update({
          data: removeNull(JSON.parse(req.body)) as any,
          where: { id: req.params.id },
        });
        return true;
      } catch (error: any) {
        console.log(error);
        return new Error(error);
      }
    },
  );
  server.post("/sortmaps", async (req: FastifyRequest<{ Body: string }>) => {
    const indexes: { id: string; parent: string; sort: number }[] = JSON.parse(req.body);
    const updates = indexes.map((idx) =>
      prisma.maps.update({
        data: {
          parentId: idx.parent,
          sort: idx.sort,
        },
        where: { id: idx.id },
      }),
    );
    try {
      await prisma.$transaction(updates);
    } catch (error) {
      console.log(error);
    }
  });

  server.delete(
    "/deletemap/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
    ) => {
      await prisma.maps.delete({
        where: { id: req.params.id },
      });
    },
  );
  server.delete(
    "/deletemaplayer/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
    ) => {
      await prisma.map_layers.deleteMany({
        where: {
          parent: req.params.id,
        },
      });
      await prisma.map_layers.delete({
        where: { id: req.params.id },
      });
    },
  );
  server.delete(
    "/deletemappin/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
    ) => {
      await prisma.map_pins.deleteMany({
        where: {
          parent: req.params.id,
        },
      });
      await prisma.map_pins.delete({
        where: { id: req.params.id },
      });
    },
  );

  done();
};
