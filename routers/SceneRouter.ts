import { FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";
import { prisma } from "..";

export const screenRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallscreenes/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {}
  ),
    server.get(
      "/getsinglescreene/:project_id",
      async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
        try {
          const screens = await prisma.screens.findMany({
            where: {
              project_id: req.params.project_id,
              OR: [
                {
                  project: {
                    ownerId: req.user_id,
                  },
                },
                {
                  project: {
                    members: {
                      some: {
                        auth_id: req.user_id,
                      },
                    },
                  },
                },
              ],
            },
          });
          return screens;
        } catch (error) {
          return false;
        }
      }
    ),
    server.post(
      "/createscreene/:project_id",
      async (
        req: FastifyRequest<{ Params: { project_id: string }; Body: string }>
      ) => {
        const data = JSON.parse(req.body) as { title: string };
        await prisma.screens.create({
          data: {
            title: data.title,
            project_id: req.params.project_id,
          },
        });
      }
    ),
    done();
};
