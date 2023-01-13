import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const tagRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/alltags/:project_id", async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
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
    return tags;
  });
  server.post("/createtag", async (req: FastifyRequest<{ Body: string }>) => {
    const { title, project_id, ...rest } = JSON.parse(req.body) as {
      project_id: string;
      title: string;
      [key: string]: any;
    };
    try {
      await prisma.tags.create({
        data: {
          title,
          project_id,
          ...rest,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return true;
  });
  server.post("/updatetag/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: string }>) => {
    const { id } = req.params;
    const { title, ...rest } = JSON.parse(req.body) as {
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
      return true;
    } catch (error) {
      console.log(error);
    }
    return true;
  });
  server.delete("/deletetags", async (req: FastifyRequest<{ Body: string }>) => {
    const { ids } = JSON.parse(req.body) as { ids: string[] };

    await prisma.tags.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return true;
  });
  server.get("/alltags/settings/:project_id", async (req: FastifyRequest<{ Params: { project_id: string }; Body: string }>) => {
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
            parent: true,
          },
        },
        edges: {
          select: {
            id: true,
            label: true,
            parent: true,
          },
        },
      },
    });
    return tags;
  });

  done();
};
