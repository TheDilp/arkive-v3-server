import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";

export const userRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post("/createuser", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const data = JSON.parse(req.body) as {
        id: string;
        nickname: string;
        email: string;
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
      // const data = JSON.parse(req.body) as {
      //   id: string;
      //   nickname: string;
      //   email: string;
      // };
      // await prisma.user.create({
      //   data,
      // });
      return true;
    } catch (error) {
      console.log(error);
    }
  });
  server.delete(
    "/deleteuser",
    async (req: FastifyRequest<{ Body: string }>) => {
      try {
        const data = JSON.parse(req.body) as {
          id: string;
        };
        await prisma.user.delete({
          where: {
            id: data.id,
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
