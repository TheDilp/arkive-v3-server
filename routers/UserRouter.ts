import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";

export const userRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/user/:user_id",
    async (
      req: FastifyRequest<{ Params: { user_id: string } }>,
      rep: FastifyReply
    ) => {
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
        rep.send(user);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createuser",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updateuser",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/addtoproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
          rep.code(500);
          rep.send("NO USER FOUND");
        }
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(500);
      }
    }
  );
  server.delete(
    "/deleteuser",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
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
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
