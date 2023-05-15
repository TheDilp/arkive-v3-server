import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
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
    async (
      req: FastifyRequest<{
        Body: WebhookEvent;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        if (data.type === "user.created") {
          await prisma.user.create({
            data: {
              auth_id: data.data.id,
              email: data.data.email_addresses[0].email_address,
              nickname:
                data.data?.username ||
                `${data.data?.first_name || ""} ${data.data?.last_name || ""}`,
            },
          });
        }
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
        console.log(error);
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
        console.log(error);
        rep.send(false);
        return;
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
        console.log(error);
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
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
