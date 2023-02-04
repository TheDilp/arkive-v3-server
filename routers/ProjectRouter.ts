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
  server.post(
    "/getsingleproject",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const singleProject = await prisma.projects.findUnique({
          where: {
            id: data.id,
          },
        });
        return singleProject;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );

  server.post(
    "/createproject",
    async (req: FastifyRequest<{ Body: string }>) => {
      console.log(req.user_id);
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
          return false;
        }
      }
    }
  );
  server.post(
    "/updateproject",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as any;
        const updatedProject = await prisma.projects.update({
          where: {
            id: data.id,
            ownerId: req.user_id,
          },
          data,
        });
        return updatedProject;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.delete(
    "/deleteproject",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.projects.delete({
          where: {
            id: data.id,
            ownerId: req.user_id,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
        return new Error("Error deleting the project.");
      }
    }
  );

  done();
};
