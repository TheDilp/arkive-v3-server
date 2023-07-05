import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";
import { db, insertUserSchema } from "../utils";
import { users, webhooks } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ResponseEnum } from "../enums/ResponseEnums";

export const userRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{ Body: { data: typeof insertUserSchema } }>,
      rep
    ) => {
      const user = insertUserSchema.parse(req.body.data);
      if (user) {
        const data = await db.insert(users).values(user);
        rep.send({ data, message: ResponseEnum.created("User"), ok: true });
      }
    }
  );
  // #endregion create_routes
  // #region read_routes
  // #endregion read_routes
  // #region update_routes
  // #endregion update_routes
  // #region delete_routes
  // #endregion delete_routes
  server.get(
    "/user/:user_id",
    async (
      req: FastifyRequest<{ Params: { user_id: string } }>,
      rep: FastifyReply
    ) => {
      const data = await db
        .select()
        .from(users)
        .where(eq(users.authId, req.params.user_id))
        .leftJoin(webhooks, eq(users.id, webhooks.userId));

      if (data)
        rep.send({ data, message: ResponseEnum.created("User"), ok: true });
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
    ) => {}
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
    ) => {}
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
    "/assignrole",
    async (
      req: FastifyRequest<{ Body: { user_id: string; role_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        await prisma.roles.update({
          where: {
            id: req.body.role_id,
          },
          data: {
            users: {
              connect: {
                id: req.body.user_id,
              },
            },
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
  server.post(
    "/revokerole",
    async (
      req: FastifyRequest<{ Body: { user_id: string; role_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        await prisma.roles.update({
          where: {
            id: req.body.role_id,
          },
          data: {
            users: {
              disconnect: {
                id: req.body.user_id,
              },
            },
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
    ) => {}
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
