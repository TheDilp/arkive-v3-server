import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { removeNull } from "../utils/transform";

export const randomTableRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get(
    "/getallrandomtables/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string } }>) => {
      try {
        const allTables = await prisma.random_tables.findMany({
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
        return allTables;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  done();
};
