import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallprojects",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.send(data);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsingleproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
            swatches: {
              select: {
                id: true,
                title: true,
                color: true,
              },
            },
          },
        });
        rep.send(singleProject);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  server.post(
    "/createproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      if (req.auth_id) {
        try {
          const newProject = await prisma.projects.create({
            data: {
              ownerId: req.auth_id,
            },
          });
          rep.send(newProject);
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    }
  );
  server.post(
    "/updateproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as any;
        const updatedProject = await prisma.projects.update({
          where: {
            id: data.id,
            ownerId: req.auth_id,
          },
          data,
        });
        rep.send(updatedProject);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleteproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  // SWATCHES
  server.post(
    "/createswatch",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      if (req.auth_id) {
        try {
          const data = JSON.parse(req.body) as {
            id: string;
            title: string;
            color: string;
            project_id: string;
          };
          const newSwatch = await prisma.swatches.create({
            data,
          });
          return newSwatch;
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    }
  );
  server.post(
    "/updateswatch",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      if (req.auth_id) {
        try {
          const data = JSON.parse(req.body) as {
            id: string;
            title: string;
          };
          await prisma.swatches.update({
            where: {
              id: data.id,
            },
            data,
          });
          return true;
        } catch (error) {
          rep.code(500);
          console.log(error);
          rep.send(false);
        }
      }
    }
  );

  server.delete(
    "/deleteswatch",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.swatches.delete({
          where: {
            id: data.id,
            project: {
              ownerId: req.auth_id,
            },
          },
        });
        return true;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
