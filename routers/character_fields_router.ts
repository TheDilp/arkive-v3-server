import { FastifyInstance, FastifyRequest } from "fastify";
import {
  characterFields,
  characterFieldsTocharacterFieldsTemplates,
} from "../drizzle/schema";
import { db } from "../utils";
import { eq } from "drizzle-orm";
import { ResponseEnum } from "../enums/ResponseEnums";

export function characterFieldsRouter(
  server: FastifyInstance,
  _: any,
  done: any
) {
  server.get(
    "/:templateId",
    async (
      req: FastifyRequest<{
        Params: {
          templateId: string;
        };
      }>,
      rep
    ) => {
      const fields = await db
        .select()
        .from(characterFieldsTocharacterFieldsTemplates)
        .where(
          eq(characterFieldsTocharacterFieldsTemplates.b, req.params.templateId)
        )
        .leftJoin(
          characterFields,
          eq(characterFields.id, characterFieldsTocharacterFieldsTemplates.a)
        );

      rep.send({ data: fields, message: ResponseEnum.generic, ok: true });
    }
  );

  done();
}
