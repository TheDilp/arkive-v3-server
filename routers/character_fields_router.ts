import { FastifyInstance, FastifyRequest } from "fastify";
import { characterFields } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { db } from "../utils";

export function characterFieldsRouter(
  server: FastifyInstance,
  _: any,
  done: any
) {
  server.get(
    "/:projectId/:templateId",
    async (
      req: FastifyRequest<{
        Params: {
          projectId: string;
          templateId: string;
        };
      }>,
      rep
    ) => {
      const fields = await db.select().from(characterFields);

      rep.send({ data: fields, message: ResponseEnum.generic, ok: true });
    }
  );

  done();
}
