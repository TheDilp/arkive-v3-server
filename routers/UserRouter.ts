import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const userRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/user/:user_id",
    async (req: FastifyRequest<{ Params: { user_id: string } }>) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            auth_id: req.params.user_id,
          },
          include: {
            members: {
              select: {
                project_id: true,
              },
            },
          },
        });
        return user;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.post("/createuser", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const data = JSON.parse(req.body) as {
        id: string;
        nickname: string;
        email: string;
        auth_id: string;
      };
      await prisma.user.create({
        data,
      });
      return true;
    } catch (error) {
      console.log(error);
    }
  });
  server.post("/updateuser", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const data = JSON.parse(req.body) as {
        id: string;
        nickname: string;
        email: string;
      };
      await prisma.user.update({
        where: {
          id: data.id,
          auth_id: req.auth_id,
        },
        data,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  server.post(
    "/addtoproject",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as {
          email: string;
          project_id: string;
        };
        const newMember = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });
        if (newMember) {
          await prisma.members.create({
            data: {
              project_id: data.project_id,
              user_id: newMember.id,
            },
          });
        } else {
          return new Error("NO USER FOUND");
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  server.delete(
    "/deleteuser",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as {
          id: string;
        };
        if (data.id === req.auth_id)
          await prisma.user.delete({
            where: {
              id: data.id,
              auth_id: req.auth_id,
            },
          });
        return true;
      } catch (error) {
        console.log(error);
      }
    }
  );

  done();
};
