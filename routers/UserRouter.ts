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
          auth_id: req.user_id,
        },
        data,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  server.delete(
    "/deleteuser",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as {
          id: string;
        };
        if (data.id === req.user_id)
          await prisma.user.delete({
            where: {
              id: data.id,
              auth_id: req.user_id,
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
