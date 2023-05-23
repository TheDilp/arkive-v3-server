import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";
import { checkIfLocal } from "../utils/auth";

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
            webhooks: {
              select: {
                id: true,
                title: true,
                url: true,
              },
            },
          },
        });
        rep.send(user);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  server.post(
    "/updateuser",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          nickname: string;
          email: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        await prisma.user.update({
          where: {
            id: data.id,
            auth_id: user_id,
          },
          data,
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/addtoproject",
    async (
      req: FastifyRequest<{
        Body: {
          email: string;
          project_id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        await prisma.projects.update({
          where: {
            id: data.project_id,
          },
          data: {
            members: {
              connect: {
                email: data.email,
              },
            },
          },
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(500);
      }
    }
  );
  server.post(
    "/removefromproject",
    async (
      req: FastifyRequest<{
        Body: {
          email: string;
          project_id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const member = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });
        if (member) {
          await prisma.projects.update({
            where: {
              id: data.project_id,
            },
            data: {
              members: {
                disconnect: {
                  email: data.email,
                },
              },
            },
          });
          rep.send(true);
        } else {
          rep.code(500);
          rep.send("NO USER FOUND");
        }
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(500);
      }
    }
  );
  server.post(
    "/createwebhook",
    async (
      req: FastifyRequest<{
        Body: {
          user_id: string;
          title: string;
          url: string;
        };
      }>,
      rep
    ) => {
      try {
        const data = req.body;
        const newWebhook = await prisma.webhooks.create({
          data: {
            title: data.title,
            url: data.url,
            user_id: data.user_id,
          },
        });
        rep.send(newWebhook);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );

  server.post(
    "/updatepermission",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          permission: { name: string; value: "Editor" | "Viewer" | "None" };
        };
      }>,
      rep
    ) => {
      try {
        const data = req.body;
        await prisma.permissions.update({
          data: {
            [data.permission.name]: data.permission.value,
          },
          where: {
            id: data.id,
          },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  server.delete(
    "/deleteuser",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const data = req.body;
        if (data.id === user_id)
          await prisma.user.delete({
            where: {
              id: data.id,
              auth_id: user_id,
            },
          });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deletewebhook",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          user_id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const u_id = checkIfLocal(req, rep);

        if (u_id === null) return;

        const { id, user_id } = data;
        await prisma.webhooks.delete({
          where: {
            id,
            user_id,
          },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  done();
};
