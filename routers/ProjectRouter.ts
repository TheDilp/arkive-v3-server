import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallprojects",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = await prisma.projects.findMany({
          where: {
            OR: [
              {
                owner: {
                  auth_id: req.auth_id,
                },
              },
              {
                members: {
                  some: {
                    member: {
                      auth_id: req.auth_id,
                    },
                  },
                },
              },
            ],
          },
          select: {
            id: true,
            title: true,
            image: true,
            ownerId: true,
            members: {
              select: {
                user_id: true,
              },
            },
          },
          orderBy: {
            title: "asc",
          },
        });
        return data;
      } catch (error) {
        console.log(error);
        return false;
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
          include: {
            members: {
              select: {
                member: {
                  select: {
                    id: true,
                    nickname: true,
                    image: true,
                  },
                },
                user_id: true,
              },
            },
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
      if (req.auth_id) {
        try {
          const newProject = await prisma.projects.create({
            data: {
              ownerId: req.auth_id,
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
            ownerId: req.auth_id,
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
            ownerId: req.auth_id,
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
