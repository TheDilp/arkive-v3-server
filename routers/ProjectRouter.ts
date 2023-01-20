import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallprojects",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const body = JSON.parse(req.body) as { ownerId: string };
        const data = await prisma.projects.findMany({
          where: {
            ownerId: body.ownerId,
          },
          select: {
            id: true,
            title: true,
            image: true,
          },
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    }
  );
  server.get(
    "/getsingleproject/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      const singleProject = await prisma.projects.findUnique({
        where: {
          id: req.params.id,
        },
      });
      return singleProject;
    }
  );

  server.post(
    "/createproject",
    async (req: FastifyRequest<{ Params: { ownerId: string } }>) => {
      const newProject = await prisma.projects.create({
        data: {
          ownerId: req.params.ownerId,
        },
      });
      return newProject;
    }
  );
  server.post(
    "/updateproject/:id",
    async (req: FastifyRequest<{ Params: { id: string }; Body: string }>) => {
      const data = JSON.parse(req.body) as any;
      const updatedProject = await prisma.projects.update({
        where: {
          id: req.params.id,
        },
        data,
      });
      return updatedProject;
    }
  );

  done();
};
