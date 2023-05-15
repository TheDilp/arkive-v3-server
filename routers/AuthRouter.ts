import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";
import { Webhook, WebhookRequiredHeaders } from "svix";

export const authRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/createuser",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const CREATE_USER_SECRET = process.env.CREATE_USER_SECRET;
        console.log(CREATE_USER_SECRET);
        if (CREATE_USER_SECRET) {
          const wh = new Webhook(CREATE_USER_SECRET);
          const data = wh.verify(req.body, req.headers as any) as WebhookEvent;

          if (data.type === "user.created") {
            await prisma.user.create({
              data: {
                auth_id: data.data.id,
                email: data.data.email_addresses[0].email_address,
                nickname:
                  data.data?.username ||
                  `${data.data?.first_name || ""} ${
                    data.data?.last_name || ""
                  }`,
              },
            });
          }
          rep.send(true);
        }
        rep.send(false);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
