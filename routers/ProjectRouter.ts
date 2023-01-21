import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallprojects",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = await prisma.projects.findMany({
          where: {
            owner: {
              auth_id: req.user_id,
            },
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
    async (req: FastifyRequest<{ Body: string }>) => {
      console.log("============", req.user_id);
      if (req.user_id) {
        try {
          const newProject = await prisma.projects.create({
            data: {
              ownerId: req.user_id,
            },
          });
          return newProject;
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
  server.post(
    "/updateproject/:id",
    async (req: FastifyRequest<{ Params: { id: string }; Body: string }>) => {
      const data = JSON.parse(req.body) as any;
      const updatedProject = await prisma.projects.update({
        where: {
          id: req.params.id,
          ownerId: req.user_id,
        },
        data,
      });
      return updatedProject;
    }
  );

  done();
};
